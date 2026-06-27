# 이식 계획서 — Moa 핵심 4기능 → 그리디 허브 `/showcase`

> `core-features-spec.md`의 4기능(**A** 링크-온리 등록 / **B** microLink resolve-once / **C** 그리드 피드 / **D** iframe 라이브뷰)을 `/showcase` 라우트 아래로 이식하는 실행 계획.
>
> **짝 문서**: 사용자가 결정할 사항은 전부 [decisions.md](decisions.md)에 모아둔다.

---

## 📌 프로토타입 vs Moa 4기능 — 역할 분리 (2026-06-27 확정)

| | 프로토타입 `prototype/*.html` | Moa 4기능 (`core-features-spec.md`) |
|---|---|---|
| **위치** | 전체 그리디 허브 UI | `/showcase` 단일 섹션 |
| **이식 방식** | HTML → Next.js 페이지·컴포넌트 (새 대화창) | DB·API·iframe 로직 (이 계획서) |
| **projects.html** | 그리디 팀 프로젝트 포트폴리오 (기수·트랙 필터) | **별개** — Moa 기능이 대체하지 않음 |
| **showcase 기능** | 프로토타입에 없음 | URL 등록 → 스크린샷 → 그리드 → iframe 라이브뷰 |

**B)가 확정:** `projects.html` = `/projects` (그리디 포트폴리오) 유지, Moa 4기능 = `/showcase` (외부 사이드 프로젝트) 별도.

---

## ✅ 확정된 결정 (2026-06-27)

| 결정 | 확정 내용 |
|---|---|
| **D1** 평가/적립(E) | **완전 제거** — RewardBadge·reward·completeSite 없음, 정렬 `createdAt desc` |
| **D2** 인증 | **`getCurrentUserId()` 헬퍼** — 지금은 상수 반환, 향후 세션은 한 곳 교체 |
| **D3** 데이터 모델 | **E 제거 + `status:'live'\|'removed'`**, `Site→Project` 리네이밍 보류 |
| **D10** 시각 시스템 | **프로토타입 soft 일관** — 카드 그림자+ring+hover lift |
| **D12** 루트 라우트 | **`/showcase`** — `app/showcase/page.tsx`. 라이브뷰 = `app/showcase/live/[siteId]/page.tsx` |
| **스타일 시스템** | **Tailwind CSS** (styled-components 제거 완료) |

---

## 📚 기능별 상세 계획

| 문서 | 내용 |
|---|---|
| [plan/0-foundation.md](plan/0-foundation.md) | **0단계 토대** — 타입·테마·DB·라우트 |
| [plan/B-screenshot.md](plan/B-screenshot.md) | **B** microLink resolve-once |
| [plan/A-register.md](plan/A-register.md) | **A** 링크-온리 등록 파이프라인 |
| [plan/C-feed.md](plan/C-feed.md) | **C** 외부 사이드 프로젝트 그리드 (`/showcase`) |
| [plan/D-live.md](plan/D-live.md) | **D** iframe 라이브뷰 (`/showcase/live/[siteId]`) |

---

## 구현 순서

| 단계 | 내용 | 상태 |
|---|---|---|
| **0. 토대** | 타입·테마·DB·env·Tailwind | ✅ 완료 |
| **읽기 인프라** | getSites · GET /api/sites · useSitesQuery · 시드 | ✅ 완료 |
| **C 그리드** | FeedGrid · SiteCard at `/showcase` | ✅ 완료 (라우트 수정됨) |
| **1. B+A** | 등록 파이프라인 (screenshotApi · frame-check · RegisterModal) | 🔴 미시작 |
| **2. D** | iframe 라이브뷰 at `/showcase/live/[siteId]` | 🔴 미시작 |

---

## 라우트 구조 (전체 그리디 허브 기준)

```
/                        ← index.html 랜딩 (프로토타입 이식)
/projects                ← projects.html 그리디 팀 포트폴리오
/showcase                ← C: 외부 사이드 프로젝트 그리드  ← Moa C-feed
/showcase/live/[siteId]  ← D: iframe 라이브뷰              ← Moa D-live
/members                 ← member.html
/missions                ← missions.html
/blog                    ← blog.html
/gallery                 ← gallery.html
/study                   ← study.html
/recruit                 ← recruit.html
/admin                   ← admin.html
```

---

## 파일별 매핑 (Showcase 기능)

| 역할 | 경로 | 레이어 |
|---|---|---|
| 타입 | `src/shared/core/types/site.ts` | core |
| DB 연결 | `src/shared/lib/db/mongodb.ts` | lib |
| 사용자 ID | `src/shared/lib/db/usersRepo.ts` | lib |
| 사이트 CRUD | `src/shared/lib/db/sitesRepo.ts` | lib |
| 시드 | `src/shared/lib/db/seedData.ts` | lib |
| 스크린샷 API (B) | `src/shared/core/api/screenshotApi.ts` | core |
| frame-check API | `src/shared/core/api/frameCheckApi.ts` | core |
| fetch 래퍼 | `src/shared/core/api/siteApi.ts` | core |
| Query 훅 | `src/shared/core/queries/siteQueries.ts` | core |
| 등록 로직 | `src/features/register/useRegisterForm.ts` | features |
| 등록 모달 | `src/features/register/RegisterModal.tsx` | features |
| 그리드 | `src/features/feed/FeedGrid.tsx` | features |
| 카드 | `src/features/feed/SiteCard.tsx` | features |
| 라이브뷰 | `src/features/live/LiveViewport.tsx` 외 | features |
| API 라우트 | `src/app/api/sites/…` · `src/app/api/frame-check/…` | app |
| 쇼케이스 페이지 | `src/app/showcase/page.tsx` | app |
| 라이브 페이지 | `src/app/showcase/live/[siteId]/page.tsx` | app |
