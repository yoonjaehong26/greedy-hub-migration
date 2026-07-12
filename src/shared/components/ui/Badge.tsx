import type { HTMLAttributes } from 'react';

export type BadgeVariant = 'solid' | 'white' | 'brand' | 'outline';

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  solid: 'bg-brand text-white',
  white: 'bg-white text-brand-700',
  brand: 'bg-brand-50 text-brand-700',
  outline: 'bg-transparent text-neutral-600 border border-neutral-200',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = 'brand', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[13px] font-semibold whitespace-nowrap ${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
