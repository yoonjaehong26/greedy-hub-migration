# 이식 계획서 — Moa 핵심 4기능 → 그리디 허브

> `core-features-spec.md`의 4기능(**A** 링크-온리 등록 / **B** microLink resolve-once / **C** 그리드 피드 / **D** iframe 라이브뷰)을 현재 Next.js 스캐폴드 위로 이식하는 실행 계획.
>
> **짝 문서**: 사용자가 결정할 사항은 전부 [decisions.md](decisions.md)에 모아둔다. 이 문서는 *"무엇을 어떤 순서로"*, decisions.md는 *"무엇을 골라야 하는지"* 를 담당한다.
>
> **갱신 규칙**: 각 단계 착수 전 decisions.md의 선행 결정 상태를 확인하고, 단계 완료 시 이 문서의 체크박스를 갱신한다.

---

## ✅ 확정된 결정 (2026-06-27)

0단계 게이트 4개가 확정됐다. 자세한 근거·나머지 미결 결정은 [decisions.md](decisions.md) 참조.

| 결정 | 확정 내용 |
|---|---|
| **D1** 평가/적립(E) | **완전 제거** — RewardBadge·reward·completeSite 없음, 정렬 `createdAt desc` |
| **D2** 인증 | **`getCurrentUserId()` 헬퍼** — 지금은 상수 반환, 향후 세션은 한 곳 교체 |
| **D3** 데이터 모델 | **E 제거 + `status:'live'\|'removed'`**, `Site→Project` 리네이밍 보류 |
| **D10** 시각 시스템 | **프로토타입 soft 일관** — 카드 그림자+ring+hover lift (Moa flat 아님) |

> 남은 미결: D11(env)·D13(폰트)·D15(테마상태) [0단계] · D4·D6·D16·D17 [1단계] · D8·D10a·D14 [2단계] · D7 [3단계] · D5·D9·D12 [가로지름]. 각 단계 착수 전 해당 결정을 먼저 짚는다.

## 📚 기능별 상세 계획 (읽기 쉬운 분리 문서)

| 문서 | 내용 |
|---|---|
| [plan/0-foundation.md](plan/0-foundation.md) | **0단계 토대** — 타입·테마·DB·폰트·라우트 |
| [plan/B-screenshot.md](plan/B-screenshot.md) | **B** microLink resolve-once (가장 중요한 비용 규칙) |
| [plan/A-register.md](plan/A-register.md) | **A** 링크-온리 등록 파이프라인 |
| [plan/C-feed.md](plan/C-feed.md) | **C** 그리드 피드 |
| [plan/D-live.md](plan/D-live.md) | **D** iframe 라이브뷰 |

---

## 1. 먼저 정리된 핵심 사실 (오해 방지)

| 사실 | 내용 |
|---|---|
| **`prototype/` 의 정체** | 빌드 없는 **정적 HTML + Tailwind 목업**(README 명시). 구현 코드가 아니다 → **디자인 참고용**이며 마크업/클래스를 그대로 이식할 수 없다(우리 스택은 styled-components). |
| **두 레퍼런스의 계통** | `prototype/` = 화면 생김새, `core-features-spec.md` = 내부 아키텍처. 후자는 **다른 앱(Moa)** 의 기능이고 **PRD에는 존재하지 않는다**. PRD=그리디 제품 기획, spec=이식할 기술 자산. |
| **도메인 매핑** | 이 루프 = 그리디 **"팀 프로젝트 아카이브"**(PRD 6.9, `/projects`)를 *'라이브 데모 임베드 갤러리'* 로 격상하는 데 쓴다. 카드의 `Site→Project`, `Page→데모/배포 URL`, 분류는 기수(Cohort)·트랙(Track). |
| **스택 결정** | PRD/README의 **Spring Boot · JPA · OpenAPI · GitHub OAuth는 "제안 단계 계획"**. 실제 구현은 CLAUDE.md 기준 **Next.js API routes + MongoDB**. 이식 중 Spring/OAuth/OpenAPI 지시는 **무시**한다. (혼란 방지를 위해 이식 PR 설명에 이 근거를 남길 것) |
| ⚠️ **검증된 사실 1** | **기능 간 import(`features/feed → features/live`)는 현재 ESLint로 강제되지 않는다.** `.eslintrc.json`의 zone은 3개뿐(`shared←features`, `core←components`, `lib←components`)이고 cross-feature zone이 없다. CLAUDE.md의 "기능 간 직접 참조 금지"는 **규약일 뿐 빌드가 막지 않는다** → [decisions.md D9](decisions.md). |
| ⚠️ **검증된 사실 2** | **루트 라우트 충돌**: `src/app/page.tsx`(플레이스홀더)가 존재한다. 피드를 `/`에 두려면 이 파일을 이동/교체해야 빌드된다 → D12. |
| ⚠️ **검증된 사실 3** | **`.env*` 파일이 없다.** `src/shared/lib/db/mongodb.ts`는 `process.env.MONGODB_URI!`(non-null)라, env 없이 sitesRepo를 import하는 순간 런타임 크래시 → D11. |

---

## 2. 의존 관계와 구현 순서

`core-features-spec.md` §0.6의 의존 그래프:

```
[A 등록] ──(B를 sitesRepo 안에서 resolve-once 호출)──► sites DB 저장(status:'live')
                                                          │  카드 탭 → router.push('/live/'+id)
                                              [C 피드] 읽어서 그리드 발견
                                                          │
                                              [D 라이브뷰] iframe 체험
```

**중요한 교정 (완전성 비평에서 확인):**
- **B는 독립 기능이 아니라 A 안에서 작동하는 비용 규칙이다.** `resolveScreenshotUrl`은 오직 `sitesRepo`(createSite/addPages/seed)에서만 호출되므로, "B 먼저"는 호출자 없는 모듈을 먼저 짓는 셈이다. → **B와 A는 한 묶음**으로 본다.
- **진짜 0단계는 결정 확정 → `site.ts`(단일 타입 출처) → env/DB 연결이다.** 데이터 모델 결정이 안 굳으면 `site.ts`가 안 굳고, 그러면 B/A/C/D 전부 컴파일 불가.

### 수정된 순서

| 단계 | 내용 | 선행 결정 (decisions.md) |
|---|---|---|
| **0. 토대** | 결정 게이트 + 공통 인프라(타입·테마·env·폰트·라우트 정리) | D1, D2, D3, D10, D11, D13, D15 |
| **1. B+A** | 등록 파이프라인(서버 쓰기경로 + resolve-once + frame-check + 등록 모달) | D4, D6, D16(id), D17 |
| **2. C** | 그리드 피드 | D8, D14, D16(thumbnailColor·domain) |
| **3. D** | iframe 라이브뷰 | D7, D6(7초 공유) |
| (가로지름) | 시드 데이터 / 레이어 강제 / 루트 라우트 | D5, D9, D12 |

---

## 3. 단계별 상세

각 작업은 `core-features-spec.md`의 §5 체크리스트 + 파일 표를 그리디 규약(styled-components·파일 상단 JSDoc·레이어)으로 **새로 작성**하는 것이다. 경로는 [scaffold 매핑](#부록-파일별-매핑)을 따른다.

### 0단계 — 토대 (Foundation)
**선행 결정(반드시 먼저 확정):** D1·D2·D3·D10·D11·D13·D15 — 결정이 서로 사슬로 묶여 있으니 **한 번에 확정하고 `site.ts`·`theme.ts`에 1회 반영**한다.

- [ ] `decisions.md`의 0단계 게이트 결정 확정 (🔴 → 🟢)
- [ ] `.env.local` + `.env.example` 작성, DB·컬렉션명 확정 — **D11**
- [ ] `nanoid` 설치 (`Page.pageId`·`Site.id` 발급용 — §0.1)
- [ ] `shared/core/types/site.ts` — 결정을 반영한 단일 타입(Page / Site / SiteDoc / 타입가드)
- [ ] `shared/core/constants/theme.ts` + `shared/components/providers/GlobalStyle.tsx` — 토큰(brand `#017356` 등) + 시각 시스템 결정 반영 — **D10**
- [ ] `src/app/layout.tsx` 에 `GlobalStyle` 주입 (현재 미주입)
- [ ] Pretendard 폰트 로딩 — **D13**
- [ ] 루트 라우트 충돌 정리 방침 확정 — **D12**
- [ ] (선택) cross-feature ESLint zone 추가 — **D9**

**Done 정의:** `tsc --noEmit` + `lint` 통과, `site.ts`/`theme` 컴파일, 앱이 부팅됨(빈 화면이라도 GlobalStyle·테마 적용 확인).

### 1단계 — B + A : 등록 파이프라인
**선행 결정:** D4(microlink 운영) · D6(frame-check) · D16(Site id) · D17(개발 mock)

- [ ] `shared/core/api/screenshotApi.ts` — **B**. `resolveScreenshotUrl` (서버 전용, microlink 1회)
- [ ] `shared/lib/db/usersRepo.ts` **또는** `getCurrentUserId` 헬퍼 — **D2** 결정에 따름
- [ ] `shared/lib/db/sitesRepo.ts` — `createSite`/`addPagesToSite`/`getSites`/`getSite`/`ensureSeeded`. 내부에서 B 호출
- [ ] `shared/lib/db/seedData.ts` — **D5** 결정에 따름
- [ ] `shared/core/api/frameCheckApi.ts` · `app/api/frame-check/route.ts` — **D6**
- [ ] `shared/core/api/siteApi.ts` · `shared/core/queries/siteQueries.ts`
- [ ] `app/api/sites/route.ts`(GET/POST) · `[siteId]/route.ts` · `[siteId]/pages/route.ts` · (`me/route.ts` 선택 — D2와 정합)
- [ ] `features/register/useRegisterForm.ts` (핵심 로직) · `RegisterModal.tsx` · `PageFieldList.tsx`
- [ ] `shared/components/ui/Icon.tsx`

**Done 정의:** URL 입력 → frame-check 선조회 → `createSite` → DB 저장(썸네일 resolve **1회**)까지 end-to-end 동작. **개발 중 microlink 쿼터 보호(D17 mock) 켠 상태로 검증.**

### 2단계 — C : 그리드 피드
**선행 결정:** D8(스케일) · D14(이미지) · D16(thumbnailColor·domain)

- [ ] `features/feed/FeedGrid.tsx` — 정렬은 D1 귀결(E 제거 시 `createdAt desc` 단일), featured 첫 카드 span-2
- [ ] `features/feed/SiteCard.tsx` — 자연 높이 메이슨리 + 4:3 그래디언트 폴백, 탭 → `router.push('/live/'+id)`
- [ ] `features/feed/useSiteThumbnail.ts` · `useFeedColumns.ts`
- [ ] `app/(feed)/page.tsx` (또는 기존 `page.tsx` 교체 — D12)
- [ ] `RewardBadge` — **D1에서 E 제거 시 만들지 않음**

**Done 정의:** 등록 사이트가 그리드에 표시, 썸네일/폴백 정상, 빈 상태 동작, 카드 탭이 라이브뷰로 이동(데드링크 방지를 위해 **D 라우트 shell 먼저 필요**).

### 3단계 — D : iframe 라이브뷰
**선행 결정:** D7(sandbox) · D6(7초 타임아웃 공유)

- [ ] `features/live/liveViewStore.ts` (Zustand, persist X, 윈도잉 최대 2)
- [ ] `features/live/useLiveGestures.ts` (탭/스와이프/휠/키, isInteractive 게이팅)
- [ ] `features/live/LiveViewport.tsx` · `LiveCard.tsx` · `BlockedCard.tsx` · `MetaStrip.tsx` · `PageDots.tsx`
- [ ] `app/live/[siteId]/page.tsx`

**Done 정의:** 카드 탭 → 라이브뷰, iframe 크로스페이드, 둘러보기↔체험 토글, 차단/7초 타임아웃 시 BlockedCard 폴백, 윈도잉 동작. **`siteId`가 목록에 없을 때(삭제/직접진입) 처리 포함** — 현재 spec 미정 동작이므로 D16/에러 UX에서 정의.

---

## 4. 작업 완료 게이트 (모든 단계 공통)

```
□ npx tsc --noEmit 통과
□ npm run lint 통과 (레이어 규칙 포함)
□ npm run test 통과 (해당 시)
□ 구조·타입·규칙 변경 시 docs/ 동기화 (CLAUDE.md 디렉토리·architecture.md)
□ 단계별 end-to-end 검증 — "파일 작성 = 완료"가 아니다. 특히 B/A는 DB·env·microlink가 살아 있어야 진짜 검증된다.
```

---

## 5. 명시적 보류 (이번 이식 범위 밖)

후속 압박으로 범위가 부풀지 않도록 **명시적으로 1차 제외**한다:

- **인증/권한**(`project:manage`, GitHub OAuth) — 데모유저 `ownerId` 고정으로 진행(D2)
- **평가·적립(E)** — `isPaid`/`reward`/`fundingSource`/`completedByMe`/`completeSite` (D1)
- **Discord 봇 · GitHub API 연동** — 미션/리뷰 도메인 소속, 별개 축
- **`Site → Project` 리네이밍** — 도메인 정합성 이점은 있으나 이식 범위를 키움(D3에서 보류)
- **OpenAPI/목서버 워크플로우** · **피드 페이지네이션**(D8)

---

## 부록: 파일별 매핑

`core-features-spec.md` §5 체크리스트 → 우리 스캐폴드 경로. (B=screenshot, A=등록, C=피드, D=라이브뷰, 공통=토대)

| spec 파일 | 우리 경로 | 레이어 | 기능 |
|---|---|---|---|
| `types/site.ts` | `src/shared/core/types/site.ts` | core | 공통 |
| `constants/theme.ts` | `src/shared/core/constants/theme.ts` | core | 공통 |
| (GlobalStyle) | `src/shared/components/providers/GlobalStyle.tsx` | components | 공통 |
| `db/usersRepo.ts` | `src/shared/lib/db/usersRepo.ts` | lib | A |
| `db/sitesRepo.ts` | `src/shared/lib/db/sitesRepo.ts` | lib | A(+B 호출) |
| `db/seedData.ts` | `src/shared/lib/db/seedData.ts` | lib | 공통 |
| `api/screenshotApi.ts` | `src/shared/core/api/screenshotApi.ts` | core | **B** |
| `api/frameCheckApi.ts` | `src/shared/core/api/frameCheckApi.ts` | core | A |
| `api/siteApi.ts` | `src/shared/core/api/siteApi.ts` | core | 공통 |
| `queries/siteQueries.ts` | `src/shared/core/queries/siteQueries.ts` | core | 공통 |
| `register/useRegisterForm.ts` | `src/features/register/useRegisterForm.ts` | features | A |
| `register/RegisterModal.tsx` | `src/features/register/RegisterModal.tsx` | features | A |
| `register/PageFieldList.tsx` | `src/features/register/PageFieldList.tsx` | features | A |
| `feed/FeedGrid.tsx` | `src/features/feed/FeedGrid.tsx` | features | C |
| `feed/SiteCard.tsx` | `src/features/feed/SiteCard.tsx` | features | C |
| `feed/useSiteThumbnail.ts` | `src/features/feed/useSiteThumbnail.ts` | features | C |
| `feed/useFeedColumns.ts` | `src/features/feed/useFeedColumns.ts` | features | C |
| `live/LiveViewport.tsx` | `src/features/live/LiveViewport.tsx` | features | D |
| `live/LiveCard.tsx` | `src/features/live/LiveCard.tsx` | features | D |
| `live/liveViewStore.ts` | `src/features/live/liveViewStore.ts` | features | D |
| `live/useLiveGestures.ts` | `src/features/live/useLiveGestures.ts` | features | D |
| `live/BlockedCard.tsx` | `src/features/live/BlockedCard.tsx` | features | D |
| `live/MetaStrip.tsx` · `PageDots.tsx` | `src/features/live/…` | features | D |
| `api/frame-check/route.ts` | `src/app/api/frame-check/route.ts` | app | A |
| `api/sites/route.ts` 외 | `src/app/api/sites/…` | app | 공통 |
| `(feed)/page.tsx` | `src/app/(feed)/page.tsx` | app | C |
| `live/[siteId]/page.tsx` | `src/app/live/[siteId]/page.tsx` | app | D |
| `ui/Icon` · `ui/RewardBadge` | `src/shared/components/ui/…` | components | 공통/C |

**레이어 주의 (빌드 안전성):**
- `SiteCard`(feed)는 `LiveViewport`(live)를 **import 금지** — `router.push`로만 이동. (단 현재 ESLint가 막지 않음 → D9)
- `screenshotApi`는 **서버 전용**. 클라이언트 컴포넌트에서 import 시 microlink 쿼터/키 누출. 호출은 `sitesRepo` 3곳에만.
- `liveViewStore`는 feature-local(persist X). 서버 응답(sites 배열)을 store에 **복사 저장 금지** — `openLive(startIndex, sites)`로 받되 인덱스/재생 상태만 보관.
- route handler(`app/api/*`)는 `shared/lib/db` + `shared/core/types`만 import. 비즈니스 로직은 `sitesRepo`로 내린다.
