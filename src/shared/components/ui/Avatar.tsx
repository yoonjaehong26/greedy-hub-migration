/* eslint-disable @next/next/no-img-element */

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 40 | 96;
  className?: string;
}

const SIZE_CLASS: Record<40 | 96, string> = {
  40: 'size-10 text-sm',
  96: 'size-24 text-3xl',
};

export function Avatar({ src, name, size = 40, className = '' }: AvatarProps) {
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
      className={`${SIZE_CLASS[size]} flex items-center justify-center rounded-full bg-neutral-100 font-semibold text-neutral-700 ${className}`}
    >
      {name.slice(0, 1)}
    </div>
  );
}
