import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'white' | 'outline-white' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-soft',
  white: 'bg-white text-brand-700 hover:bg-neutral-50',
  'outline-white': 'bg-transparent text-white border-[1.5px] border-white hover:bg-white/10',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100',
  outline: 'bg-transparent text-neutral-700 border border-neutral-200 hover:bg-neutral-50',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-[13px] rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-base rounded-xl',
};

const BASE_CLASS =
  'inline-flex items-center justify-center gap-1.5 font-semibold whitespace-nowrap transition-colors disabled:opacity-50 disabled:pointer-events-none';

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const cls = `${BASE_CLASS} ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`;

  if ('href' in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={cls} {...rest}>
        {props.children}
      </Link>
    );
  }

  const { children, ...rest } = props as ButtonAsButton;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
