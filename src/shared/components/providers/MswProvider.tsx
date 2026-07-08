/**
 * MswProvider.tsx — 개발 모드 MSW 목서버 게이트
 *
 * NEXT_PUBLIC_API_MOCK=true 일 때만 브라우저 워커를 기동하고, 워커가 준비된 후에만
 * children을 렌더한다(그 전에 나가는 fetch가 인터셉트 안 되는 경쟁 상태 방지).
 * 플래그가 꺼져 있으면(기본값) 즉시 children을 렌더 — 프로덕션 번들에 워커 시작 코드가 실행되지 않는다.
 */
'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

const MOCK_ENABLED = process.env.NEXT_PUBLIC_API_MOCK === 'true';

export function MswProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!MOCK_ENABLED);

  useEffect(() => {
    if (!MOCK_ENABLED) return;

    let active = true;
    import('@/mocks/browser').then(({ worker }) =>
      worker.start({ onUnhandledRequest: 'bypass' }).then(() => {
        if (active) setReady(true);
      }),
    );

    return () => {
      active = false;
    };
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
