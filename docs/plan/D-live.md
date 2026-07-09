# D · iframe 라이브뷰 — 핵심 체험

> **한 줄**: 등록된 사이트를 **살아있는 iframe**으로 띄워 스토리처럼 넘겨 보고, 원할 때 진짜로 조작한다. 가장 큰 차별점.
>
> **라우트**: `/showcase/live/[siteId]`
> **선행**: C(여기서 진입 — `/showcase`) · **걸린 결정**: D7(sandbox)·D6(7초 타임아웃 공유) · **상태**: 재생 상태는 Zustand(persist X)
>
> 📄 개요: [../migration-plan.md](../migration-plan.md) · 결정: [../decisions.md](../decisions.md)

---

## 🎯 한눈에

- **무엇을**: 사이트/페이지를 iframe으로 띄우고, 스와이프·탭으로 넘기며, "체험하기"로 실제 조작.
- **왜**: 스크린샷이 아니라 **진짜 동작하는 화면**을 보여주는 게 Moa의 핵심 가치.
- **체감**: 인스타 스토리처럼 좌우로 페이지, 위아래로 사이트를 넘기다 마음에 들면 직접 클릭.

---

## 🔁 구조 (4부분)

```
LiveViewport  (app/live/[siteId]/page.tsx 가 siteId 전달)
  ├─ useSitesQuery → live 필터 → URL siteId로 시작 인덱스 → openLive(startIndex, sites)
  ├─ 반응형 letterbox:  ~768 세로 스토리 / 768~899 좁은 세로(420px) / 900+ 16:9
  ├─ key={siteIndex:pageIndex} 로 항목 전환 시 리마운트(로드 상태 초기화)
  └─ 구성:  LiveCard + PageDots(현재 페이지) + MetaStrip(제목/카운트) + useLiveGestures

LiveCard  (iframe 카드)
  ├─ page.frameBlocked → 즉시 BlockedCard
  ├─ <iframe sandbox="allow-scripts allow-same-origin allow-forms allow-popups">  ※ top-navigation 없음 (D7)
  ├─ 로딩 오버레이 → onLoad 크로스페이드 / 7초 타임아웃 → BlockedCard (D6)
  └─ 🔑 Shield 토글:
        둘러보기(기본)  투명 Shield가 제스처를 가로채 "이동 전용" → 하단 "체험하기"
        체험            enterInteract() → Shield 제거 → iframe이 입력 소유 → "둘러보기로" 칩(exitInteract)

liveViewStore  (Zustand · persist X)
  state:   currentSiteIndex, currentPageIndex, isInteractive, cardState, timers
  actions: openLive/closeLive/nextPage/prevPage/nextSite/prevSite/enterInteract/exitInteract
  윈도잉:  cardState = { 현재, nextEntry } 최대 2개만  (메모리/iframe 개수 제한)

useLiveGestures
  좌/우 탭·← →        → 페이지 이동
  세로 스와이프·휠·↑ ↓ → 사이트 이동
  isInteractive=true  → 모든 이동 제스처 비활성(iframe이 입력 소유)
```

---

## 📂 만드는 파일

| 파일 | 레이어 | 역할 |
|---|---|---|
| `features/live/LiveViewport.tsx` | features | 오케스트레이션·시작인덱스·letterbox·제스처 부착 |
| `features/live/LiveCard.tsx` | features | iframe 크로스페이드·7초 타임아웃·Shield(둘러보기/체험) |
| `features/live/liveViewStore.ts` | features | 인덱스·윈도잉(최대 2)·`isInteractive` (persist X) |
| `features/live/useLiveGestures.ts` | features | 탭/스와이프/휠/키 → store, `isInteractive` 게이팅 |
| `features/live/BlockedCard.tsx` | features | 차단/타임아웃 폴백(스크린샷 배경 + 새 탭 열기) |
| `features/live/MetaStrip.tsx` · `PageDots.tsx` | features | 제목/카운트, 페이지 인디케이터(표시 전용) |
| `app/showcase/live/[siteId]/page.tsx` | app | 진입점 — `params.siteId`를 `LiveViewport`에 전달만 |

---

## 🧩 핵심 로직 / 주의

- **윈도잉 불변식**: `cardState`에는 **현재 + 다음 1개 = 최대 2개**만. `nextEntry`는 *같은 사이트 다음 페이지 → 다음 사이트 0페이지 → null*. iframe이 무한정 쌓이는 걸 막는다.
- **이동은 경계에서 no-op**(바운스), **모든 이동은 `isInteractive=false`로 리셋**(체험 중 넘기면 다시 둘러보기로).
- **휘발성**: `closeLive`가 모든 `timers`를 `clearTimeout`하고 전체 초기화 → persist 미적용.
- **서버 응답 복사 금지**: `openLive(startIndex, sites)`로 받되 store엔 인덱스/재생 상태만. 사이트 배열을 store에 복사하지 않는다(Query 캐시가 단일 출처).
- **Shield의 핵심**: 둘러보기 모드에선 투명 Shield가 위를 덮어 제스처를 "이동"으로만 쓰고, 체험 모드에선 Shield를 치워 iframe이 클릭/스크롤/폼을 소유한다. 버튼 탭은 `stopPropagation`으로 부모 제스처 오인 방지.

### ⚠️ spec에 없는 미정 동작 (여기서 정의 필요)
- **`siteId`가 목록에 없을 때** (삭제된/`removed`/직접 URL 진입): 시작 인덱스가 `-1`이 된다. → 빈 상태/리다이렉트/첫 사이트로 폴백 중 하나를 정해야 함. (에러 UX)

---

## ⚖️ 이 기능의 결정

| 결정 | 상태 | 요지 |
|---|---|---|
| **D7** sandbox | 🔴 | 원본 유지 + `referrerpolicy="no-referrer"`·`allow=""` 보강, top-nav 금지 유지 |
| **D6** 7초 타임아웃 | 🔴 | A의 frame-check와 공유, 상수화 |
| (파생) siteId 미존재 | 🔴 | -1 처리 정의 (D10a/에러 UX와 함께) |

---

## ✅ 완료 체크리스트
- [ ] D7·D6 확정 + siteId 미존재 처리 정의
- [ ] `liveViewStore`(윈도잉·게이팅) → `useLiveGestures` → `LiveViewport`/`LiveCard`
- [ ] `BlockedCard` · `MetaStrip` · `PageDots`
- [ ] `app/showcase/live/[siteId]/page.tsx`
- [ ] `tsc`/`lint` 통과

**Done 정의**: 카드 탭 → 라이브뷰, iframe 크로스페이드, 둘러보기↔체험 토글, 차단/7초 타임아웃 시 BlockedCard 폴백, 윈도잉 최대 2 유지, siteId 미존재 시 우아한 처리.

⬅️ 이전: [C-feed.md](C-feed.md) · 🏁 4기능 완료 후: 인증/권한·평가적립(E)·Discord 연동은 별개 축(범위 밖)
