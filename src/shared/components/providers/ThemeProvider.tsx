'use client';

import { type ReactNode, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import { useThemeStore } from '@/shared/core/stores/themeStore';

const GlobalStyle = createGlobalStyle`
  :root, [data-theme="light"] {
    --c-brand: #017356;
    --c-brand-soft: #02916C;
    --c-brand-deep: #014C39;
    --c-bg: #f8fafc;
    --c-surface: #ffffff;
    --c-text: #0f172a;
    --c-text-sub: #64748b;
    --c-border: rgb(15 23 42 / 0.1);
  }
  [data-theme="dark"] {
    --c-brand: #02916C;
    --c-brand-soft: #017356;
    --c-brand-deep: #34d399;
    --c-bg: #0f172a;
    --c-surface: #1e293b;
    --c-text: #f8fafc;
    --c-text-sub: #94a3b8;
    --c-border: rgb(248 250 252 / 0.1);
  }
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    background: var(--c-bg);
    color: var(--c-text);
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    transition: background-color 0.2s, color 0.2s;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useThemeStore((s) => s.colorScheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorScheme);
  }, [colorScheme]);

  return (
    <>
      <GlobalStyle />
      {children}
    </>
  );
}
