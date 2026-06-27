'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ColorScheme = 'light' | 'dark';

interface ThemeState {
  colorScheme: ColorScheme;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      colorScheme: 'light',
      toggle: () =>
        set((s) => {
          const next: ColorScheme = s.colorScheme === 'light' ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', next);
          document.documentElement.classList.toggle('dark', next === 'dark');
          return { colorScheme: next };
        }),
    }),
    {
      name: 'greedy-hub-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.setAttribute('data-theme', state.colorScheme);
          document.documentElement.classList.toggle('dark', state.colorScheme === 'dark');
        }
      },
    }
  )
);
