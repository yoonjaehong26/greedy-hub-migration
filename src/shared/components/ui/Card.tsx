import type { HTMLAttributes } from 'react';

export function Card({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[20px] border border-neutral-200 bg-white p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
