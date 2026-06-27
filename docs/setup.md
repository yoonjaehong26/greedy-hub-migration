# Setup Guide — 그리디 허브 (Greedy Hub)

새 프로젝트 1회성 초기화. 이후 읽을 필요 없음.

## 1. 의존성 설치

```bash
npm i next react react-dom typescript \
      styled-components zustand @tanstack/react-query mongodb

# 개발
npm i -D eslint eslint-config-next eslint-plugin-import \
        husky lint-staged vitest @vitejs/plugin-react tsx \
        @types/node @types/react @types/react-dom
```

## 2. ESLint 설정 — 완성본 복사

`.eslintrc.json` 을 프로젝트 루트에 생성 후 아래 내용 붙여넣기.

```jsonc
{
  "extends": ["next/core-web-vitals", "next/typescript"],
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
    }],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

레이어 규칙 상세 설명 → `docs/architecture.md`

## 3. tsconfig path alias

```jsonc
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## 4. husky + lint-staged

```bash
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

`package.json` 에 추가:

```jsonc
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "lint": "eslint src --ext .ts,.tsx",
    "test": "vitest run",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix"]
  }
}
```

`tsc --noEmit` 는 lint-staged에서 제외.  
커밋마다 전체 타입체크는 느리므로 CI 또는 `npm run build` 전에 별도 실행 권장.

## 5. MongoDB 연결 싱글턴

`src/shared/lib/db/mongodb.ts`

```typescript
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}

export default clientPromise;
```

## 6. QueryClientProvider

`src/shared/components/providers/AppQueryProvider.tsx`

```tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function AppQueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () => new QueryClient({
      defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
    }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

## 7. 검증

```bash
npx tsc --noEmit   # 타입
npm run lint       # 레이어 규칙 포함
npm run test       # vitest
```

레이어 확인: `src/shared/` 아무 파일에서 `@/features/...` import 시 lint 에러가 나면 정상.
