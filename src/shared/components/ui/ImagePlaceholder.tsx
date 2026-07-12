/* eslint-disable @next/next/no-img-element */

interface ImagePlaceholderProps {
  src?: string | null;
  alt?: string;
  ratio?: '16:9';
  className?: string;
}

const RATIO_CLASS: Record<'16:9', string> = {
  '16:9': 'aspect-video',
};

export function ImagePlaceholder({ src, alt = '', ratio = '16:9', className = '' }: ImagePlaceholderProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${RATIO_CLASS[ratio]} w-full rounded-xl object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${RATIO_CLASS[ratio]} flex w-full items-center justify-center rounded-xl bg-neutral-100 ${className}`}
    >
      <span className="text-[13px] text-neutral-500">사진</span>
    </div>
  );
}
