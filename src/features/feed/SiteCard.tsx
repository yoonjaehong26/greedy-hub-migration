'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Site } from '@/shared/core/types/site';
import { useSiteThumbnail } from './useSiteThumbnail';

interface Props {
  site: Site;
  featured?: boolean;
}

export function SiteCard({ site, featured = false }: Props) {
  const router = useRouter();
  const screenshotUrl = useSiteThumbnail(site);
  const [imgError, setImgError] = useState(false);

  const showImage = screenshotUrl && !imgError;

  return (
    <article
      className={`${featured ? 'col-span-2' : 'col-span-1'} bg-[var(--c-surface)] rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden cursor-pointer transition-[transform,box-shadow] duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2`}
      onClick={() => router.push(`/showcase/live/${site.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && router.push(`/showcase/live/${site.id}`)}
    >
      <div
        className="w-full aspect-[16/10] overflow-hidden"
        style={{ background: site.thumbnailColor }}
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={screenshotUrl}
            alt={site.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-1"
            style={{
              background: `linear-gradient(135deg, ${site.thumbnailColor}cc, ${site.thumbnailColor}66)`,
            }}
          >
            <span className="text-white text-sm font-semibold opacity-90">{site.domain}</span>
            <span className="text-white text-xs opacity-70">{site.pages.length}페이지</span>
          </div>
        )}
      </div>

      <div className="px-4 py-3.5 flex flex-col gap-1">
        <h3 className="text-[0.9375rem] font-semibold text-[var(--c-text)] leading-[1.3] whitespace-nowrap overflow-hidden text-ellipsis">
          {site.title}
        </h3>
        <p className="text-[0.8125rem] text-[var(--c-text-sub)] leading-normal line-clamp-2">
          {site.description}
        </p>
        <span className="text-xs text-brand mt-1">{site.domain}</span>
      </div>
    </article>
  );
}
