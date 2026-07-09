'use client';

import { type ReactNode, useEffect } from 'react';
import { useThemeStore } from '@/shared/core/stores/themeStore';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useThemeStore((s) => s.colorScheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorScheme);
    document.documentElement.classList.toggle('dark', colorScheme === 'dark');
  }, [colorScheme]);

  return <>{children}</>;
}
