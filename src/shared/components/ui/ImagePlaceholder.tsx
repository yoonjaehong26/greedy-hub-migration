'use client';

import { useState } from 'react';

interface ImagePlaceholderProps {
  src?: string | null;
  alt?: string;
  ratio?: '16:9';
  className?: string;
}

const RATIO_CLASS: Record<'16:9', string> = {
  '16:9': 'aspect-video',
};

/**
 * 16:9 사진 셸.
 * - src가 없거나 로드에 실패하면 "사진" 플레이스홀더로 폴백한다.
 * - 이미지는 항상 고정 비율 박스 안에서 object-cover 되므로,
 *   외부 URL이 죽거나 원본 비율이 제각각이어도 카드 높이가 무너지지 않는다.
 */
export function ImagePlaceholder({ src, alt = '', ratio = '16:9', className = '' }: ImagePlaceholderProps) {
  const [failed, setFailed] = useState(false);
  const box = `${RATIO_CLASS[ratio]} w-full overflow-hidden rounded-xl bg-neutral-100 ${className}`;

  if (src && !failed) {
    return (
      <div className={box}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${box} flex items-center justify-center`}>
      <span className="text-[13px] text-neutral-500">사진</span>
    </div>
  );
}
