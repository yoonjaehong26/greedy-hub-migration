/**
 * AppQueryProvider.tsx — TanStack Query 클라이언트 프로바이더
 *
 * 서버 상태의 단일 출처. QueryClient 를 useState 로 한 번만 생성해 리렌더 시 캐시가 날아가지 않게 한다.
 * 사용처: app/layout.tsx 루트에서 트리 전체를 감싼다.
 */
'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function AppQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
