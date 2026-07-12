/* eslint-disable @next/next/no-img-element */

type AvatarSize = 32 | 40 | 96;
type AvatarTone = 'neutral' | 'brand';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  tone?: AvatarTone;
  className?: string;
}

const SIZE_CLASS: Record<AvatarSize, string> = {
  32: 'size-8 text-[13px]',
  40: 'size-10 text-sm',
  96: 'size-24 text-3xl',
};

const TONE_CLASS: Record<AvatarTone, string> = {
  neutral: 'bg-neutral-100 text-neutral-700',
  brand: 'bg-brand-50 text-brand-700',
};

export function Avatar({ src, name, size = 40, tone = 'neutral', className = '' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${SIZE_CLASS[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${SIZE_CLASS[size]} flex items-center justify-center rounded-full font-semibold ${TONE_CLASS[tone]} ${className}`}
    >
      {name.slice(0, 1)}
    </div>
  );
}
