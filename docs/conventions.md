# Conventions — 그리디 허브 (Greedy Hub)
> 요약은 `CLAUDE.md` 참조. 여기는 스타일·네이밍 상세.

## 파일 명명
| 종류 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 | PascalCase | `ItemCard.tsx` |
| 스토어 | `*Store.ts` | `settingsStore.ts` |
| API | `*Api.ts` | `itemApi.ts` |
| Query 훅 | `*Queries.ts` | `itemQueries.ts` |
| 훅 | `use*.ts` | `useCardGestures.ts` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 공유 타입 | PascalCase, `shared/core/types/` 에만 | `ContentItem` |

---

## 파일 상단 JSDoc (모든 파일 필수)
```typescript
/**
 * 파일명.ts — 한줄 요약
 *
 * 상세 설명 (무엇을, 왜, 어떻게)
 * 사용처: 어디에서 import되는지
 */
```

---

## 파일 내 코드 순서
| 파일 타입 | 순서 |
|---|---|
| 컴포넌트 | Imports → Constants → Types → Component 함수 |
| 훅 | Types → Hook 함수 (Refs → State → Callbacks → Effects → Return) |
| Store | Types → 초기 상태 → Store 정의 → Selector 헬퍼 |

**섹션 구분선**
- 300줄+: `═══` 메인 + `━━━` 서브
- 100~300줄: `───`
- 100줄 미만: 구분선 없이 JSDoc만

> **기존 주석 보전**: 코드 정리 중에도 삭제·축약 금지

---

## Import 순서
```typescript
// 1. React / Next
import { useState } from 'react';
// 2. 외부 라이브러리
import { useQuery } from '@tanstack/react-query';
// 3. 내부 (@/ alias)
import { itemQueries } from '@/shared/core/queries/itemQueries';
```

---

## Props 네이밍 — 모호함보다 명확함
```tsx
// boolean: is / should / has + 주어 명시
isScrollFocused        // ✅    isActive       // ❌ 모호
shouldHideTopBar       // ✅    hideTopBar     // ❌ 의도 불명

// 콜백: on + 명사 + 동사
onItemSelectRequest    // ✅    onSelect       // ❌ 무엇의?

// string/number: 포맷·단위를 JSDoc으로
/** CSS gradient 문자열 (예: 'linear-gradient(...)') */
gradient?: string;
```

---

## Tailwind CSS
```tsx
// 테마 컬러는 CSS 변수 또는 @theme inline 토큰 사용
<div className="bg-[var(--c-surface)] text-brand border-[var(--c-border)]" />

// 동적 값 (런타임에 결정되는 수치)은 style prop 병용
<div
  className="grid gap-4"
  style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
/>

// 다크모드: data-theme 속성 전환 방식 (Tailwind dark: 변형 대신)
// globals.css 의 [data-theme='dark'] 블록이 CSS 변수를 재정의함
```

브랜드 컬러 (`text-brand`, `bg-brand`, `bg-brand-soft`, `bg-brand-deep`) 는  
`globals.css` 의 `@theme inline` 블록에서 CSS 변수와 매핑되어 있어 다크모드에서도 자동 전환된다.

---

## TypeScript
- `any` 금지. 불가피하면 `unknown` + 타입 가드
- 공유 타입은 `shared/core/types/` 에 단일 출처
- discriminated union 분기 시 타입 가드 함수 작성

```typescript
const isVersePage = (p: Page): p is VersePage => p.type === 'verse';
```

---

## 금지 / 권장 요약
| 금지 | 권장 |
|---|---|
| `any` 타입 | `unknown` + 타입 가드 |
| 인라인 스타일 (레이아웃용) | Tailwind 클래스 |
| 하드코딩 색상 | CSS 변수 (`var(--c-*)`) |
| `console.log` 커밋 | `logger` 유틸 사용 |
| 기존 주석 삭제·축약 | 반드시 보전 |
| shared → features import | props/render prop으로 DI |
