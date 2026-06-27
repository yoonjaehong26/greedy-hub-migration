# Architecture — 그리디 허브 (Greedy Hub)

## 레이어 의존 방향 (단방향)
```
features/ → shared/*      ✅ 허용
shared/   → features/     ❌ 금지
features/A → features/B   ❌ 금지
```

| 레이어 | 위치 | import 가능 대상 |
|---|---|---|
| features | `src/features/*` | shared/core · lib · components |
| shared/components | `src/shared/components/*` | shared/core · lib |
| shared/lib | `src/shared/lib/*` | shared/core · 외부 라이브러리 |
| shared/core | `src/shared/core/*` | 외부 라이브러리만 (core 내부 간 참조 허용) |
| shared/reader | `src/shared/reader/*` | **features 의존 허용** (유일한 예외) |

---

## 위반 시 해결책 — 의존성 역전(DI)
```tsx
// ❌ shared 컴포넌트에서 feature store import
import { useFeatureStore } from '@/features/x/xStore';

// ✅ props로 주입
interface ListProps {
  items: Item[];
  onItemSelect?: (id: string) => void;
}
```

---

## ESLint 레이어 강제 설정
```jsonc
// .eslintrc.json
{
  "plugins": ["import"],
  "rules": {
    "import/no-restricted-paths": ["error", {
      "zones": [
        {
          "target": "./src/shared",
          "from": "./src/features",
          "except": ["./src/shared/reader"],
          "message": "레이어 위반: shared는 features를 import할 수 없습니다."
        },
        {
          "target": "./src/shared/core",
          "from": "./src/shared/components",
          "message": "레이어 위반: core는 components를 import할 수 없습니다."
        },
        {
          "target": "./src/shared/lib",
          "from": "./src/shared/components",
          "message": "레이어 위반: lib은 components를 import할 수 없습니다."
        }
      ]
    }]
  }
}
```
> `reader` 예외는 `except` 필드로 명시적으로 처리

---

## 상태 관리 원칙
| 상태 종류 | 도구 | 위치 |
|---|---|---|
| 서버 데이터 (fetch·캐시·동기화) | TanStack Query | `shared/core/queries/` |
| 클라이언트·UI 상태 (모달·설정·선택) | Zustand | `shared/core/stores/` |

- 서버 응답을 Zustand에 **복사 저장 금지** (Query 캐시가 단일 출처)

### queryKey 중앙화 패턴
```typescript
export const queryKeys = {
  items: {
    all: ['items'] as const,
    detail: (id: string) => ['items', id] as const,
  },
};
```

### Zustand persist 규칙
- store별 고유 key: `'greedy-hub-{{domain}}'`
- 스키마 변경 시 `version` 올리고 `migrate()` 작성 **필수**

```typescript
persist(storeImpl, {
  name: 'greedy-hub-settings',
  version: 1,
  migrate: (persisted, version) => { /* ... */ },
});
```

---

## 문서 동기화 (코드 수정 후 확인)
| 수정한 코드 | 확인할 문서 |
|---|---|
| `features/*` 추가·삭제·이동 | CLAUDE.md 디렉토리 구조 |
| store·query 추가·변경 | architecture.md persist key·queryKeys |
| 레이어 import 패턴 변경 | architecture.md 레이어 규칙 |
