# C · 그리드 피드

> **한 줄**: 등록된 프로젝트를 한눈에 **발견**. 인스타식 그리드 + 매력적인 카드를 앞에 배치.
>
> **선행**: A(등록 데이터가 있어야 함) · **걸린 결정**: D8(스케일)·D10a(썸네일 높이)·D14(이미지) · **이동**: 카드 탭 → `router.push('/live/'+id)`
>
> 📄 개요: [../migration-plan.md](../migration-plan.md) · 결정: [../decisions.md](../decisions.md)

---

## 🎯 한눈에

- **무엇을**: `GET /api/sites` 전체 목록 → `status:'live'`만 → 정렬 → 카드 그리드.
- **왜**: 등록된 것을 빠르게 둘러보고 라이브뷰로 진입시키는 발견(discovery) 화면.
- **체감**: 스크린샷 썸네일이 자연스럽게 깔린 갤러리, 카드를 누르면 실제 사이트 체험으로.

---

## 🔁 동작 흐름

```
FeedGrid  (app/(feed)/page.tsx 가 렌더)
  ├─ useSitesQuery()           GET /api/sites (페이지네이션 없음, D8)
  ├─ status:'live' 필터
  ├─ 정렬:  createdAt desc      ← E 제거(D1)로 단일 키 (reward/completedByMe 없음)
  ├─ featured: index===0 && columns>1  →  grid-column: span 2 (시각 위계)
  └─ sticky 상단바(워드마크 · 테마토글 · 등록 + → RegisterModal) · 빈 상태(등록 유도)

SiteCard
  ├─ useSiteThumbnail(site)  →  screenshotUrl
  ├─ 있으면: 이미지 렌더 (높이 정책 = D10a)
  ├─ 없으면/onError: thumbnailColor 그래디언트 + 도메인/페이지수 폴백
  └─ 클릭 → router.push('/live/' + site.id)     ※ import 아님!
```

---

## 📂 만드는 파일

| 파일 | 레이어 | 역할 |
|---|---|---|
| `features/feed/FeedGrid.tsx` | features | 목록·필터·정렬·featured·sticky바·빈상태 |
| `features/feed/SiteCard.tsx` | features | soft 카드(D10) + 썸네일/폴백, 탭 → 라이브뷰 |
| `features/feed/useSiteThumbnail.ts` | features | `(홈 ?? pages[0])?.screenshotUrl ?? null` (읽기 전용) |
| `features/feed/useFeedColumns.ts` | features | `<480px→2열`, 그 외 3열 (resize 갱신) |
| `app/(feed)/page.tsx` | app | 진입점(로직 없음) — `FeedGrid` 렌더만 |

> ❌ **`RewardBadge`는 만들지 않는다** (D1 E 제거). `SiteCard`에 `isPaid`/`reward` 분기 없음.

---

## 🎨 카드 스타일 — 확정 + 미결이 만나는 지점

| 축 | 결정 | 내용 |
|---|---|---|
| **표면** | 🟢 D10 | soft: `rounded-2xl` + `shadow-sm` + `ring-1` + `hover:-translate-y-0.5` |
| **썸네일 높이** | 🔴 **D10a** | ① 자연높이 메이슨리(권장 — 스크린샷 비율 보존) vs ② 고정높이(프로토타입 픽셀일치, 잘림) |

> 💡 D10에서 카드 *표면*은 soft로 정했지만, 스크린샷을 **온전히** 보여줄지(자연높이) 모든 카드를 똑같은 높이로 맞출지(고정)는 별개 선택이라 **D10a**로 분리했다. 권장은 자연높이 — microlink 스크린샷의 가치를 살린다. soft 카드 표면 *안에* 자연높이 이미지를 넣으면 둘 다 만족.

---

## 🧩 핵심 로직 / 주의

- **정렬 단순화(D1 효과)**: Moa 원본은 `completedByMe → reward → createdAt`이었으나 E 제거로 **`createdAt desc` 단일**. featured 조건도 `index===0 && columns>1`만.
- **feed → live는 라우터 이동**: `SiteCard`가 `features/live`를 **import하면 안 된다**(레이어 위반). `router.push`로만. ⚠️ 현재 ESLint가 이걸 못 막으니(D9) 주의해서 작성.
- **클라는 microlink를 안 부른다**: 썸네일은 저장된 `screenshotUrl`을 읽을 뿐(`useSiteThumbnail`).
- **데드링크 방지**: 카드 탭 목적지인 D 라우트(`app/live/[siteId]/page.tsx`)의 shell이 최소한 있어야 404가 안 난다 → C 완료 전 D 라우트 stub 필요.

---

## ⚖️ 이 기능의 결정

| 결정 | 상태 | 요지 |
|---|---|---|
| **D8** 스케일 | 🔴 | 서버 status 필터 + 전체 live 반환(페이지네이션 보류) |
| **D10a** 썸네일 높이 | 🔴 | 자연높이 메이슨리 권장 |
| **D14** 이미지 | 🔴 | `<img>` 권장(외부 도메인이라 next/image 이점 적음) |
| **D12** 루트 라우트 | 🔴 | 피드를 `/`로 둘지 → `page.tsx` 처리 |
| D1 / D10 | 🟢 | 정렬 단일 · soft 카드 |

---

## ✅ 완료 체크리스트
- [ ] D8·D10a·D14·D12 확정
- [ ] `FeedGrid` + `SiteCard` + `useSiteThumbnail` + `useFeedColumns`
- [ ] `app/(feed)/page.tsx` (또는 `page.tsx` 교체 — D12)
- [ ] D 라우트 shell 존재 확인(데드링크 방지)
- [ ] `tsc`/`lint` 통과

**Done 정의**: 등록 사이트가 그리드에 뜨고, 썸네일/폴백·빈 상태가 정상이며, 카드 탭이 라이브뷰로 이동한다.

➡️ 다음: [D-live.md](D-live.md)
