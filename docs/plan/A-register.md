# A · 링크-온리 등록 파이프라인

> **한 줄**: 제작자가 **URL 하나만** 붙여넣으면 끝. 스크린샷·썸네일·임베드 설정 전부 자동, 검수 큐 없이 즉시 노출(`status:'live'`).
>
> **선행**: 0단계 + B(스크린샷) · **걸린 결정**: D4·D6·D16(id)·D17 · **포함**: B의 resolve-once 호출
>
> 📄 개요: [../migration-plan.md](../migration-plan.md) · 결정: [../decisions.md](../decisions.md)

---

## 🎯 한눈에

- **무엇을**: 제목·URL·설명만 받아 사이트를 즉시 등록. 추가 페이지(최대 3)는 선택.
- **왜**: 등록 마찰을 0에 가깝게 → 콘텐츠가 빨리 쌓인다.
- **체감**: "링크 붙여넣기 → 등록 완료 → 자동 썸네일".

---

## 🔁 동작 흐름 (2단계 — `useRegisterForm`이 캡슐화)

```
Phase 1 · 기본 정보 (제목 · 홈 URL · 설명)
  1. validate()           제목/설명 비었나, URL이 http(s) 유효한가(new URL)
  2. checkFrameBlocked()  ── GET /api/frame-check?url= ──► { frameBlocked }   ※클라가 등록 시점에 선조회
  3. createSite()         ── POST /api/sites ──► 서버가 ┌ 홈 URL 스크린샷 resolve-once (B)
                                                        ├ ownerId = getCurrentUserId()
                                                        ├ status:'live', thumbnailColor=팔레트
                                                        └ id·pageId = nanoid
  4. 성공 → createdSiteId 보관, Phase 2로 전환

Phase 2 · 추가 페이지 (선택, 최대 3) — "건너뛰기" 가능
  1. 유효한(URL+라벨) 페이지만 필터
  2. 각 페이지 checkFrameBlocked()  ── Promise.all 병렬 ──►
  3. addPages()  ── POST /api/sites/[siteId]/pages ──► 서버가 각 페이지 resolve(B) 후 $push
```

> 💡 **frame-check를 등록 시점에 클라가 선조회**해서 `frameBlocked`를 저장한다. → 라이브뷰(D)는 실시간 차단 감지(불안정)에 의존하지 않고 이 캐시만 본다. **판정 안전 기본값은 "차단"**(모르면 막아 iframe 깨짐 방지).

---

## 📂 만드는 파일

### 서버 (쓰기 경로 + 라우트)
| 파일 | 레이어 | 역할 |
|---|---|---|
| `shared/lib/db/sitesRepo.ts` | lib | `createSite`/`addPagesToSite`/`getSites`/`getSite`/`ensureSeeded`. **내부에서 B resolve-once 호출**. `id`/`pageId`=nanoid, `toSite(doc)`로 `_id` 제거 |
| `shared/lib/db/usersRepo.ts` | lib | `getCurrentUserId()` (0단계에서 생성) |
| `shared/lib/db/seedData.ts` | lib | 시드 원본 (D5) |
| `app/api/frame-check/route.ts` | app | UA 위장+4초 타임아웃 요청 → XFO/CSP 검사, 실패=차단 (D6) |
| `app/api/sites/route.ts` | app | `GET`=목록, `POST`=검증 후 `createSite(input, getCurrentUserId())` → 201 |
| `app/api/sites/[siteId]/route.ts` | app | `GET` 단건 → `toSite` |
| `app/api/sites/[siteId]/pages/route.ts` | app | `POST` → `addPagesToSite` |

### 클라이언트 (등록 UI + fetch 경계)
| 파일 | 레이어 | 역할 |
|---|---|---|
| `shared/core/api/frameCheckApi.ts` | core | `checkFrameBlocked(url): Promise<boolean>` — 실패 시 `true`(차단) |
| `shared/core/api/siteApi.ts` | core | `getSites`/`getSite`/`createSite`/`addPages` fetch 래퍼 |
| `shared/core/queries/siteQueries.ts` | core | `useSitesQuery`/`useSiteQuery`/`useCreateSiteMutation`/`useAddPagesMutation` (※`useComplete`/`useMe` 없음 — D1·D2) |
| `features/register/useRegisterForm.ts` | features | **핵심 로직** — phase/fields/errors, validate, submit, addPages |
| `features/register/RegisterModal.tsx` | features | 2단계 모달(ESC 닫기, body scroll lock, 슬라이드 전환). soft solid 카드(D10) |
| `features/register/PageFieldList.tsx` | features | Phase 2 동적 페이지 입력 행(URL+라벨, 최대 3) |
| `shared/components/ui/Icon.tsx` | components | 등록 `+`, 닫기 등 공용 아이콘 |

`useRegisterForm` 반환:
```ts
{ phase, fields, errors, setField, submit, isSubmitting,
  additionalPages, setAdditionalPages, addPages, createdSiteId }
```

---

## 🧩 핵심 로직 / 주의

- **즉시 저장**: 등록은 홈 1개로 바로 저장(사용자를 기다리게 하지 않음), 페이지 추가는 **별개 호출**.
- **컴포넌트는 Query 훅만**: `RegisterModal`은 `siteApi`를 직접 부르지 않고 `useCreateSiteMutation`을 쓴다. fetch/DB는 `*Api.ts`·`sitesRepo`에만(규칙 3).
- **라우트는 얇게**: route handler는 검증 + `sitesRepo` 호출만. 비즈니스 로직은 `sitesRepo`로 내린다.
- **D1 효과**: `createSite` 입력에 `isPaid`/`reward` 없음. 저장도 `status:'live'`만 신경 쓴다.

---

## ⚖️ 이 기능의 결정

| 결정 | 상태 | 요지 |
|---|---|---|
| **D6** frame-check | 🔴 | 4s/7s, unknown=차단, 상수화 |
| **D16** id 생성 | 🔴 | `Site.id`=nanoid, `domain`=www 제거 |
| **D4 / D17** | 🔴 | B 쪽 결정 (쿼터·mock) |
| D1 / D2 / D3 | 🟢 | E 없음 · ownerId=헬퍼 · status 2개 |

---

## ✅ 완료 체크리스트
- [ ] D6·D16 확정 (D4·D17은 B와 공유)
- [ ] `sitesRepo` + 4개 API 라우트
- [ ] `frameCheckApi` + `frame-check/route.ts`
- [ ] `siteApi` + `siteQueries`
- [ ] `useRegisterForm` + `RegisterModal` + `PageFieldList` + `Icon`
- [ ] `tsc`/`lint` 통과

**Done 정의**: URL 입력 → frame-check 선조회 → `createSite` → DB 저장(썸네일 **1회** resolve)까지 **end-to-end** 동작. (개발 중 D17 mock 켠 상태로 검증 — 파일 작성만으로는 완료 아님, DB·env 필요.)

➡️ 다음: [C-feed.md](C-feed.md)
