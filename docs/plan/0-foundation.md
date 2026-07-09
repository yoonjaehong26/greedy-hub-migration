# 0단계 · 토대 (Foundation)

> **한 줄**: 확정된 결정을 코드로 굳히고, 모든 기능이 딛고 설 공통 바닥(**타입 · 테마 · DB연결 · 폰트**)을 만든다.
>
> **선행 결정**: D1·D2·D3·D10 ✅확정 / **D11·D13·D15 미결** · **결과물**: `site.ts`, `theme.ts`, `GlobalStyle`, `getCurrentUserId`, `.env`
>
> 📄 개요: [../migration-plan.md](../migration-plan.md) · 결정: [../decisions.md](../decisions.md)

---

## 🎯 왜 0단계가 먼저인가

```
            ┌─────────────────────────────────────────┐
   결정 ──► │  site.ts (단일 타입)   theme.ts (디자인)  │ ──► B·A·C·D 전부 여기에 의존
            │  getCurrentUserId      MongoDB 연결       │
            └─────────────────────────────────────────┘
```

- B/A/C/D는 전부 `site.ts`를 import한다 → **타입이 안 굳으면 아무것도 컴파일 안 된다.**
- 모든 화면이 `theme.ts` 토큰을 읽는다(하드코딩 색상 금지 규약) → **테마 없이는 카드 한 장도 못 그린다.**
- 서버 쓰기는 MongoDB를 쓴다 → **env 없으면 첫 등록에서 크래시**(`mongodb.ts`가 `MONGODB_URI!`).

즉 0단계 = "**결정 → 타입·테마·연결**". 여기가 흔들리면 뒤가 다 흔들린다.

---

## 🧱 만드는 것

### 1) 데이터 타입 — `src/shared/core/types/site.ts`
4기능 전체의 **단일 출처**. 확정된 결정을 반영한 최종 형태:

```ts
interface Page {
  pageId: string;              // nanoid (D16)
  label: string;               // "홈" 등 등록자 입력
  url: string;
  isHome: boolean;             // pages[0]만 true
  frameBlocked: boolean;       // [A]frame-check 캐시 → [D]iframe 시도 여부
  frameCheckedAt: string;      // ISO
  screenshotUrl: string | null; // [B]microlink 결과 → [C]썸네일 [D]폴백배경
  ogDescription: string | null; // [D]BlockedCard 설명
}

interface Site {
  id: string;                  // nanoid (D16)
  ownerId: string;             // getCurrentUserId() (D2)
  title: string;
  description: string;
  domain: string;              // new URL(url).hostname, www 제거 (D16)
  thumbnailColor: string;      // 폴백 그래디언트 (D16)
  pages: Page[];               // 1~4개 (홈 + 최대 3)
  status: 'live' | 'removed';  // reported 제외 (D3)
  createdAt: string;
  updatedAt: string;
}
```

> 💡 **E 제거(D1)의 효과**: `isPaid`/`reward`/`fundingSource`/`completedByMe`가 사라져 **`SiteDoc`이 `Site`와 동일**해진다. 따라서 `toSite(doc)`는 `userId` 인자 없이 `_id`만 제거하면 끝 — Moa 원본보다 매핑이 단순하다.

### 2) 디자인 토큰 — Tailwind 설정 + `globals.css`
| 항목 | 값 (프로토타입 `site.js`에서 이식) |
|---|---|
| 브랜드 | `brand: #017356` · `brand-soft: #02916C` · `brand-deep: #014C39` |
| 중립 | slate 계열 (라이트 `slate-50` 배경 / 다크 `slate-900`) |
| **카드 (D10 soft 확정)** | `rounded-2xl` + `shadow-sm` + `ring-1`(slate-900/5) + `hover:-translate-y-0.5` |
| 폰트 | Pretendard (jsDelivr CDN, globals.css 또는 layout.tsx link) |
| 다크모드 | `[data-theme="dark"]` CSS 변수 방식, FOUC 방지 인라인 스크립트 |

- **styled-components 제거 완료** — `StyledComponentsRegistry` · `GlobalStyle` 없음.
- Tailwind 클래스를 프로토타입 HTML에서 그대로 이식 가능.

### 3) 사용자 식별 — `getCurrentUserId` (D2)
```ts
// src/shared/lib/db/usersRepo.ts
export const ME_USER_ID = 'user-me-001';
export function getCurrentUserId(): string {
  return ME_USER_ID;   // 향후: 그리디 세션에서 조회하도록 이 한 줄만 교체
}
```
- 등록(`POST /api/sites`)·라우트가 **이 함수만** 호출 → 인증 도입은 한 곳 교체로 끝.

### 4) env / DB 연결 — **D11 (미결)**
```bash
# .env.local  (그리고 값 없는 .env.example 커밋)
MONGODB_URI=mongodb+srv://...      # 필수 — 없으면 첫 DB 작업에서 크래시
MICROLINK_API_KEY=                 # 선택 (D4)
MOCK_SCREENSHOTS=true              # 선택 — 개발 중 쿼터 보호 (D17)
```
- **DB명·컬렉션명 확정 필요** (예: DB `greedy-hub`, 컬렉션 `sites`/`users`). spec에 명시 없음.
- ⚠️ MongoDB Atlas URI가 준비돼 있어야 1단계 검증 가능.

### 5) 나머지 미결 / 정리 작업
- **D13 폰트**: `next/font/local`(self-host, 권장) vs CDN — woff2 자산 필요.
- **D15 테마상태**: `shared/core/stores`에 작은 Zustand(persist `greedy-hub-theme`) + `[data-theme]`, FOUC 방지.
- **D12 루트 라우트**: `src/app/page.tsx`(플레이스홀더)를 어떻게 할지 — 피드를 `/`로 둘지 결정(2단계와 연결).
- **D9 (선택)**: cross-feature ESLint zone 추가 — `feed → live` import를 빌드가 막게 할지.

---

## ⚖️ 이 단계의 결정

| 결정 | 상태 | 요지 |
|---|---|---|
| D1 평가/적립 | 🟢 | 완전 제거 → 타입에서 E 필드 제외 |
| D2 인증 | 🟢 | `getCurrentUserId` 헬퍼 |
| D3 데이터모델 | 🟢 | status `live\|removed`, 리네이밍 보류 |
| D10 시각시스템 | 🟢 | soft 카드 토큰 |
| **D11** env | 🔴 | DB/컬렉션명·`.env.example` |
| **D13** 폰트 | 🔴 | next/font vs CDN |
| **D15** 테마상태 | 🔴 | Zustand persist + FOUC |

---

## ✅ 완료 체크리스트
- [ ] D11·D13·D15 확정 (착수 전 짚기)
- [ ] `nanoid` 설치
- [ ] `site.ts` 작성 → `tsc --noEmit` 통과
- [ ] `theme.ts` + `GlobalStyle.tsx` 작성 + `layout.tsx` 주입 → 앱 부팅 시 테마 적용 확인
- [ ] `getCurrentUserId` 헬퍼
- [ ] `.env.local` + `.env.example` + DB/컬렉션명 확정
- [ ] `npx tsc --noEmit` · `npm run lint` 통과

**Done 정의**: 타입·테마가 컴파일되고, 앱이 부팅되며(빈 화면이라도) 브랜드 그린·Pretendard·다크토글이 적용된다.

➡️ 다음: [B-screenshot.md](B-screenshot.md)
