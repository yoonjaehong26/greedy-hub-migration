# Moa 핵심 4기능 이전 명세 (등록 · 스크린샷 · 피드 · 라이브뷰)

> **대상 커밋**: `09f46e0` (실제 코드 검증 기준)
> **이전 대상(이 문서 범위)**: 아래 4개만. **평가/적립(E)·인증·커뮤니티·역할 등은 제외.**
> - **A. 링크-온리 등록 파이프라인** (`features/register`)
> - **B. microLink resolve-once 규칙** (가장 중요한 비용 규칙)
> - **C. 그리드 피드** (`features/feed`)
> - **D. iframe 라이브뷰** (`features/live`) — 핵심 체험
>
> 이 4개로 **"링크 붙여넣기 → 자동 썸네일 → 그리드에서 발견 → iframe으로 실제 체험"**이라는 Moa의 코어 루프가 완성된다. 평가/적립은 이 위에 얹는 별개 축이라 뺐다.

---

## 0. 공통 전제 (4기능이 공유하는 토대)

### 0.1 데이터 모델 (`shared/core/types/site.ts`) — 4기능 전부의 단일 출처
```ts
interface Page {
  pageId: string;            // nanoid
  label: string;             // "홈" 등 등록자 입력
  url: string;
  isHome: boolean;           // pages[0]만 true
  frameBlocked: boolean;     // [A] 등록 시 frame-check 결과 캐시 → [D] iframe 시도 여부 결정
  frameCheckedAt: string;    // ISO
  screenshotUrl: string | null;  // [B] microlink resolve 결과 → [C]썸네일 [D]폴백배경
  ogDescription: string | null;  // [D] BlockedCard 설명
}
interface Site {
  id: string; ownerId: string;
  title: string; description: string; domain: string;
  thumbnailColor: string;    // [B]실패 시 그래디언트 폴백 ([C][D] 공용)
  isPaid: boolean; reward: number; fundingSource: 'platform'|'escrow';  // ※ 평가/적립(E) 전용 — 4기능에선 표시만
  pages: Page[];             // 1~4개(홈 + 최대 3)
  status: 'live'|'reported'|'removed';   // [C] 피드는 'live'만
  completedByMe: boolean;    // ※ 평가(E) 전용 — [C] 정렬에만 영향
  createdAt: string; updatedAt: string;
}
```
> ⚠️ `isPaid`/`reward`/`fundingSource`/`completedByMe`는 **평가·적립(E)** 소속이다. 4기능만 이식한다면 이 필드들은 **빼거나 표시 전용으로 남겨도 된다**(§5 체크리스트 참고).

### 0.2 레이어 규칙 (단방향)
```
features/ → shared/*        (가능)
shared/   → features/       (금지)
features/A → features/B     (금지) — feed→live 전환은 router.push('/live/'+id)만, import 아님
```

### 0.3 상태관리 · fetch 경계
- **서버 데이터**(사이트/페이지/스크린샷/frameBlocked) = TanStack Query (`shared/core/queries/siteQueries.ts`)
- **라이브뷰 재생 상태**(인덱스·윈도우·체험여부) = Zustand `features/live/liveViewStore.ts` (feature-local, persist X)
- **fetch는 `shared/core/api/`에만**: `siteApi`(/api/sites,/api/me) · `screenshotApi`(microlink, **서버전용**) · `frameCheckApi`(/api/frame-check). 컴포넌트는 Query 훅만 쓴다.

### 0.4 인증 — 이 시점엔 **없음**
단일 하드코딩 데모 유저 `ME_USER_ID='user-me-001'`(`shared/lib/db/usersRepo.ts`). 등록 `ownerId`, 라우트 사용자 식별 전부 이 id. 4기능만 보면 **사용자 개념이 거의 필요 없다**(등록자 = 고정).

### 0.5 디자인 토큰 (`shared/core/constants/theme.ts` + `GlobalStyle`)
색/그림자는 CSS 변수(`var(--c-*)`), 실제 라이트/다크 값은 `GlobalStyle`이 `[data-theme]`에 주입. 컴포넌트는 `theme.colors.*`/`theme.spacing.*`만 쓴다(하드코딩 금지). 인스타식 flat(카드 그림자 없음), Pretendard.

### 0.6 4기능 의존 관계
```
[A 등록] ──(B resolve-once로 screenshotUrl·frameBlocked 채움)──► sites 저장
                                                                  │
                                                  [C 피드] 읽어서 그리드 발견
                                                                  │ 카드 탭 → router.push
                                                  [D 라이브뷰] iframe으로 체험
```
**B는 A 안에서 작동하는 비용 규칙**이고, C는 A가 만든 데이터를 읽기만, D는 그걸 iframe으로 띄운다.

---

## A. 링크-온리 등록 파이프라인 (`features/register`)

### 목적
제작자가 **URL 하나만** 붙여넣으면 끝. 스크린샷 업로드·썸네일 제작·임베드 설정 전부 자동. "검수 큐" 없이 즉시 노출(`status:'live'`)해 마찰을 0에 가깝게.

### 동작 흐름 (2단계 — `useRegisterForm.ts`가 캡슐화)

**Phase 1 — 기본 정보** (`RegisterModal` 입력: 제목 · 홈 URL · 설명)
1. `validate(fields)` — 제목/설명 비어있는지, URL이 `http(s)` 유효한지(`new URL`).
2. **클라이언트가 먼저** `checkFrameBlocked(homeUrl)` 호출 → `GET /api/frame-check?url=` → `{frameBlocked}`.
   - 서버가 대상에 요청(UA 위장, 4초 타임아웃)해 `X-Frame-Options: deny|sameorigin` **또는** CSP `frame-ancestors`가 `*`가 아니면 **차단**. 요청 실패(타임아웃/네트워크)는 **안전하게 차단**으로 처리.
3. `useCreateSiteMutation` → `POST /api/sites` → 서버 `createSite`가 **홈 URL 스크린샷을 microlink로 1회 resolve**(=B)해 `Page`에 저장. `ownerId=ME_USER_ID`, `isPaid:false`, `reward:0`, `status:'live'`, `thumbnailColor`=팔레트 순환.
4. 성공 시 `createdSiteId` 보관, `phase=2`로 전환.

**Phase 2 — 추가 페이지(선택, 최대 3)** (`PageFieldList`: URL+라벨 행 동적 추가)
1. 유효한(URL·라벨 모두 입력된) 페이지만 필터.
2. 각 페이지 `checkFrameBlocked`를 **`Promise.all` 병렬** 조회.
3. `useAddPagesMutation` → `POST /api/sites/[siteId]/pages` → 서버 `addPagesToSite`가 각 페이지 스크린샷 resolve(=B) 후 `$push`. "건너뛰기"로 생략 가능.

### 기술 요소
| 파일 | 역할 |
|---|---|
| `features/register/RegisterModal.tsx` | 2단계 모달 UI(글래스모피즘, ESC 닫기, body scroll lock, PhaseContainer 슬라이드 전환). `useRegisterForm` 소비 |
| `features/register/PageFieldList.tsx` | Phase 2 동적 페이지 입력 행(URL+라벨, 최대 3) |
| `features/register/useRegisterForm.ts` | **핵심 로직** — `phase`/`fields`/`errors` 상태, `validate`, `submit`(frame-check→createSite), `addPages`(병렬 frame-check→addPages). 반환: `{phase, fields, errors, setField, submit, isSubmitting, additionalPages, setAdditionalPages, addPages, createdSiteId}` |
| `shared/core/api/frameCheckApi.ts` | `checkFrameBlocked(url): Promise<boolean>` — 실패 시 `true`(차단) |
| `app/api/frame-check/route.ts` | 서버 헤더 검사. `isBlockedByCsp`(frame-ancestors≠`*`), XFO deny/sameorigin, 타임아웃 4s, 실패=차단 |
| `app/api/sites/route.ts` (POST) | body 검증(title/homeUrl/description 필수) → `createSite(input, ME_USER_ID)` → 201 |
| `app/api/sites/[siteId]/pages/route.ts` (POST) | `addPagesToSite` |
| `shared/lib/db/sitesRepo.ts` | `createSite`/`addPagesToSite` — 내부에서 B(resolve-once) 수행 |

### 핵심 결정 / 주의
- **frame-check를 클라이언트가 등록 시점에 선조회**해서 `frameBlocked`를 createSite 입력으로 넘긴다 → 라이브뷰는 실시간 차단 감지(불안정)에 의존하지 않고 이 캐시만 본다.
- **차단 판정의 안전 기본값은 "차단"** — 모르면 막아서 iframe 깨짐(빈 화면)을 방지하고 BlockedCard로 폴백.
- 등록은 홈 1개로 즉시 저장(사용자를 기다리게 하지 않음), 페이지 추가는 별개 호출.

---

## B. microLink resolve-once 규칙 (가장 중요한 비용 규칙)

### 목적
스크린샷은 **사이트당 정확히 1회**만 외부 API(microlink, 무료 50건/일)를 소모한다. 사용자 수·조회 수가 아무리 늘어도 비용이 선형으로 터지지 않게 하는 핵심 불변식.

### 동작
```ts
// shared/core/api/screenshotApi.ts — 서버에서만 호출
resolveScreenshotUrl(pageUrl): Promise<string|null>
//  GET https://api.microlink.io/?url=…&screenshot=true&meta=false&waitUntil=networkidle0
//  → data.screenshot.url (microlink CDN 호스팅 이미지) | 실패 시 null
```
- `waitUntil=networkidle0`: JS 렌더가 끝난 뒤 캡처(로딩 스피너 중간 캡처 방지).
- 반환 URL은 **microlink CDN 이미지**라, 한 번 받아 DB에 저장하면 이후 `<img>` 로드는 쿼터를 안 쓴다.

### 호출 지점 — **오직 `shared/lib/db/sitesRepo.ts`** 안 3곳
| 시점 | 함수 | resolve 대상 |
|---|---|---|
| 사이트 등록 | `createSite` | 홈 페이지 1개 |
| 페이지 추가 | `addPagesToSite` | 추가된 각 페이지 |
| 최초 시드 | `ensureSeeded`→`buildSeedDocs` | 시드 사이트의 **홈만**(그리드 썸네일이 홈뿐이라) |

저장 형태는 `SiteDoc`(= `Omit<Site,'completedByMe'> & { completedBy: string[] }`), 응답 시 `toSite(doc,userId)`가 `_id` 제거(projection `{_id:0}`).

### 클라이언트는 읽기만
```ts
// features/feed/useSiteThumbnail.ts
useSiteThumbnail(site) => (홈페이지 ?? pages[0])?.screenshotUrl ?? null
```
**클라이언트는 절대 microlink를 직접 호출하지 않는다.** 값이 `null`이면 호출 측이 `thumbnailColor` 그래디언트로 폴백.

### 불변식 / 주의
- 새 화면에서 스크린샷이 필요해지면 **클라 resolve를 추가하지 말고**, 쓰기 경로(등록/페이지추가/시드)에 resolve를 끼워 넣는다.
- 서비스 교체(다른 스크린샷 API) 시 `screenshotApi.ts`만 수정.

---

## C. 그리드 피드 (`features/feed`)

### 목적
등록된 프로젝트를 한눈에 **발견**. 인스타식 미니멀 그리드 + 매력적인 카드를 앞에 배치.

### 동작 / 기술 요소
**`FeedGrid.tsx`** (`app/(feed)/page.tsx`가 렌더)
- `useSitesQuery()` = `GET /api/sites`(전체 목록, 페이지네이션 없음). `status:'live'`만 필터.
- **정렬**: `completedByMe`(미완료 우선) → `reward` desc → `createdAt` desc. *(앞 두 키는 평가/적립(E) 의존 — §5 참고)*
- **featured**: 첫 카드(`index===0 && !completedByMe && columns>1`)는 `grid-column: span 2`로 2칸 차지(시각적 위계, 폰 레스토프).
- sticky 상단바(워드마크 + 테마 토글 + 등록 `+` → `RegisterModal`), 빈 상태(등록 유도).

**`SiteCard.tsx`**
- 썸네일은 `useSiteThumbnail`로 읽은 `screenshotUrl`을 **자연 높이**(`width:100%; height:auto`)로 렌더 — microlink가 캡처한 뷰포트 비율이 사이트마다 달라(데스크톱 16:10, 모바일 9:19.5 등) 강제 4:3은 잘림/여백을 만든다. 그래서 **메이슨리식 가변 높이**.
- 캡처 실패(`screenshotUrl` 없음 또는 `<img> onError`)면 **4:3 고정 박스 + `thumbnailColor` 그래디언트 + 중앙 도메인/페이지수** 폴백.
- 이미지 위 하단 캡션(도메인 · N페이지), `isPaid`면 우상단 `RewardBadge`*(E 의존)*.
- 클릭 → `router.push('/live/'+site.id)`.

**`useFeedColumns.ts`**: `< 480px → 2열`, 그 외 `3열`(`DEFAULT_COLUMNS=3`). `Content` max-width 1100px 기준 카드폭 가독성 균형점. (`resize` 리스너로 갱신)

### 주의 — 평가(E) 결합 지점
- 정렬의 `completedByMe`·`reward`, 카드의 `RewardBadge`/`isPaid`는 평가/적립에서 온다. **E를 빼면**: 정렬을 `createdAt desc`만으로 단순화하고, `RewardBadge`/`isPaid` 분기를 제거하면 깔끔하다.

---

## D. iframe 라이브뷰 (`features/live`) — 핵심 체험

### 목적
등록된 사이트를 **실제로 띄워 체험**. 스크린샷이 아니라 **살아있는 iframe**으로, 스토리처럼 사이트/페이지를 넘기며 보고, 원할 때 진짜로 조작한다. Moa의 가장 큰 차별점.

### D-1. 오케스트레이션 — `LiveViewport.tsx` (`app/live/[siteId]/page.tsx`가 `siteId` 전달)
- `useSitesQuery`로 전체 로드 → `status:'live'`만 → URL `siteId`로 **시작 인덱스** 결정 → `openLive(startIndex, sites)`.
- `LiveCard` + `PageDots`(현재 페이지 표시) + `MetaStrip`(제목/페이지 카운트) 조합, `useLiveGestures` 부착.
- 카드는 `key={siteIndex:pageIndex}`로 **항목 전환 시 리마운트**(로드 상태 자동 초기화).
- **반응형 letterbox**(같은 컴포넌트): 모바일~768px 세로 스토리 / 768~899px 좁은 세로카드(`theme.liveCard.desktopWidth=420px`) / 900px+ 와이드 16:9(`cqw/cqh` 컨테이너 쿼리로 정확히 letterbox).
- 언마운트 시 `closeLive()`로 타이머 정리.

### D-2. iframe 카드 + 🔑 둘러보기/체험 토글 — `LiveCard.tsx`
- `page.frameBlocked` → 즉시 `BlockedCard`(폴백). 아니면:
- `<iframe src={page.url} sandbox="allow-scripts allow-same-origin allow-forms allow-popups">` — ⚠️ **`allow-top-navigation` 없음**(임베드 사이트가 부모 화면 가로채기 차단).
- 로딩 오버레이(`thumbnailColor` + 스피너) → `onLoad` 시 `$isReady`로 크로스페이드(opacity transition). **7초 타임아웃** 시 `BlockedCard` 폴백.
- **Shield 토글(핵심)**:
  - **둘러보기(기본, `isInteractive=false`)**: iframe 위에 투명 `Shield`(z-index)를 덮어 **제스처를 가로채 사이트/페이지 이동 전용**으로. 하단에 "**체험하기**" 버튼.
  - "체험하기" → `enterInteract()` → Shield 제거 → **iframe이 입력 소유**(실제 클릭/스크롤/폼). 좌상단 "**둘러보기로**" 칩(`exitInteract()`)으로만 복귀.
  - 버튼 탭은 `stopPropagation`으로 부모 제스처(페이지 이동) 오인 방지.

### D-3. 재생 상태 + 윈도잉 — `liveViewStore.ts` (Zustand, persist X)
```ts
state: { currentSiteIndex, currentPageIndex, isInteractive, cardState, timers }
actions: openLive, closeLive, nextPage, prevPage, nextSite, prevSite, enterInteract, exitInteract
```
- **윈도잉 불변식**: `cardState`에는 **현재 항목 + `nextEntry`(다음 페이지 또는 다음 사이트의 0페이지) 1개 = 최대 2개**만 둔다. `openLive`/`nextPage`/`nextSite`가 매번 `{현재, 다음}`으로 `cardState`를 재설정 → 메모리/iframe 개수 제한.
  ```ts
  nextEntry(sites, s, p): 같은 사이트 다음 페이지 → 다음 사이트 0페이지 → null
  ```
- 이동은 경계에서 **no-op**(바운스). **모든 이동은 `isInteractive`를 false로 리셋**(체험 중 넘기면 다시 둘러보기로).
- `closeLive`: 모든 `timers` `clearTimeout` + 전체 초기화 → **휘발성이라 persist 미적용**.

### D-4. 제스처 — `useLiveGestures.ts`
| 동작 | 입력 |
|---|---|
| 다음/이전 **페이지** | 좌/우 탭(`dx,dy<12`, `[data-live-zone]` 안, 화면 좌/우 절반) · `←` `→` |
| 다음/이전 **사이트** | 세로 스와이프(`|dy|>40 && |dy|>|dx|`) · 휠(디바운스 400ms, `|deltaY|≥24`) · `↑` `↓` |
- **`isInteractive=true`면 모든 이동 제스처 비활성**(iframe이 입력 소유). 둘러보기 모드에서만 Shield가 제스처를 받는다.
- 포인터다운에서 `[data-live-zone]` 안인지 기록 → 포인터업에서 탭/스와이프 판정. 키보드는 `document`에, 휠/포인터는 컨테이너에 바인딩.

### D-5. 폴백 — `BlockedCard.tsx`
`frameBlocked`이거나 7초 타임아웃 시: 등록 때 resolve된 **스크린샷을 배경**(`object-fit:cover`) + 좌상단 "미리보기 제한" 잠금 배지 + 하단 "**새 탭에서 열기**"(`window.open(url,'_blank','noopener,noreferrer')`) + (있으면) `ogDescription`. 스크린샷도 없으면 `thumbnailColor` 그래디언트.

### 기술 요소 표
| 파일 | 역할 |
|---|---|
| `features/live/LiveViewport.tsx` | 오케스트레이션·시작인덱스·반응형 letterbox·제스처 부착 |
| `features/live/LiveCard.tsx` | iframe 크로스페이드·7초 타임아웃·Shield(둘러보기/체험) |
| `features/live/liveViewStore.ts` | 인덱스·윈도잉(최대2)·isInteractive |
| `features/live/useLiveGestures.ts` | 탭/스와이프/휠/키 → store, isInteractive 게이팅 |
| `features/live/BlockedCard.tsx` | 차단 폴백(스크린샷+새탭) |
| `features/live/MetaStrip.tsx` · `PageDots.tsx` | 제목/페이지 카운트, 페이지 인디케이터(표시 전용) |

---

## 1~4 요약 한 장
```
A 등록(URL만) ─┬─ frame-check(클라 선조회) → frameBlocked 캐시 ─────────┐
               └─ B resolve-once(microlink, 서버 sitesRepo) → screenshotUrl ─┤
                                                                            ▼
                                            sites 저장(status:'live')
                                                                            ▼
C 피드: useSitesQuery → live 필터 → 정렬 → SiteCard(썸네일 자연높이/4:3폴백) ─ 탭 → router.push
                                                                            ▼
D 라이브뷰: iframe 크로스페이드 ─ frameBlocked/7s → BlockedCard
            둘러보기(Shield+제스처 이동) ⇄ 체험(iframe 입력소유)  ·  윈도잉 최대 2
```

---

## 5. 새 프로젝트로 가져갈 때 체크리스트 (E·인증 제거 시 손볼 곳)

이식할 파일(4기능):
```
shared/core/types/site.ts            # (Site에서 isPaid/reward/fundingSource/completedByMe는 선택 제거)
shared/core/api/{siteApi,screenshotApi,frameCheckApi}.ts
shared/core/queries/siteQueries.ts   # useSitesQuery/useSiteQuery/useCreateSite/useAddPages (useComplete/useMe 제외)
shared/lib/db/{mongodb,sitesRepo,seedData}.ts   # sitesRepo에서 completeSite/completedBy 제거 가능
app/api/sites/route.ts · sites/[siteId]/route.ts · sites/[siteId]/pages/route.ts · frame-check/route.ts
features/register/*  ·  features/feed/*  ·  features/live/*
shared/core/constants/theme.ts · shared/components/{providers,ui/Icon,ui/RewardBadge}
```
**E(평가/적립) 제거 시 손볼 곳**:
- `Site`에서 `isPaid/reward/fundingSource/completedByMe` 제거(또는 표시 전용 유지).
- `FeedGrid` 정렬 → `createdAt desc`만. `SiteCard`의 `RewardBadge`/`isPaid` 분기 제거.
- `sitesRepo`의 `completeSite`/`completedBy`, `app/api/sites/[siteId]/complete`, `siteQueries.useCompleteSiteMutation` 삭제.
- `RewardBadge` 컴포넌트 미사용 시 제거.

**인증 제거/대체**: 등록 `ownerId`는 고정값이면 충분. 다중 사용자가 필요해지면 `usersRepo`/세션만 교체하면 4기능 코드는 거의 그대로.

> **전승 리트머스**: 새 입력이 생기면 *"이걸 **링크 하나**로 받아 microLink 프리뷰 + iframe 체험으로 보여줄 수 있나?"* 를 먼저 묻는다. 스크린샷이 필요하면 **클라 resolve 금지 — 쓰기 경로에 resolve-once**.
