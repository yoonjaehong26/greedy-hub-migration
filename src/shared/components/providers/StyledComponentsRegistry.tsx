/**
 * StyledComponentsRegistry.tsx — App Router SSR 스타일 주입 레지스트리
 *
 * styled-components 는 App Router 에서 SSR 시 스타일을 직접 flush 해야 FOUC 가 없다.
 * useServerInsertedHTML 로 첫 렌더의 스타일 태그를 <head> 에 주입하고, 클라이언트에서는 그대로 통과시킨다.
 * 사용처: app/layout.tsx 에서 AppQueryProvider 바깥을 감싼다. (next.config 의 compiler.styledComponents 와 함께 동작)
 */
'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export function StyledComponentsRegistry({ children }: { children: ReactNode }) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  // 클라이언트에서는 레지스트리 없이 통과 (브라우저는 styled-components 가 직접 주입)
  if (typeof window !== 'undefined') return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
