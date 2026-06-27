export const theme = {
  colors: {
    brand: 'var(--c-brand)',
    brandSoft: 'var(--c-brand-soft)',
    brandDeep: 'var(--c-brand-deep)',
    bg: 'var(--c-bg)',
    surface: 'var(--c-surface)',
    text: 'var(--c-text)',
    textSub: 'var(--c-text-sub)',
    border: 'var(--c-border)',
  },
  radius: {
    card: '1rem',
    sm: '0.5rem',
  },
  shadow: {
    card: '0 1px 2px 0 rgb(0 0 0 / 0.05), 0 0 0 1px rgb(15 23 42 / 0.05)',
    cardHover: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 0 0 1px rgb(15 23 42 / 0.05)',
  },
  liveCard: {
    width: '420px',
  },
} as const;

export type AppTheme = typeof theme;
