import type { ButtonHTMLAttributes } from 'react';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export function Chip({ selected = false, className = '', children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
        selected
          ? 'bg-brand-700 text-white'
          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
