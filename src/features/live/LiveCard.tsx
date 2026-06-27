'use client';

import { useState, useEffect, useRef } from 'react';
import type { Site, Page } from '@/shared/core/types/site';
import { BlockedCard } from './BlockedCard';

interface Props {
  site: Site;
  page: Page;
  isInteractive: boolean;
}

const TIMEOUT_MS = 7000;

export function LiveCard({ site, page, isInteractive }: Props) {
  const [blocked, setBlocked] = useState(page.frameBlocked);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Reset on page change
    if (page.frameBlocked) {
      setBlocked(true);
      return;
    }

    setBlocked(false);
    timerRef.current = setTimeout(() => setBlocked(true), TIMEOUT_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [page]);

  if (blocked) {
    return <BlockedCard site={site} />;
  }

  return (
    <div className="relative w-full h-full">
      <iframe
        key={page.pageId}
        src={page.url}
        onLoad={() => {
          if (timerRef.current) clearTimeout(timerRef.current);
        }}
        className="w-full h-full border-none"
        title={`${site.title} — ${page.label}`}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
      {/* Shield: 둘러보기 모드에서 iframe 직접 조작 차단 */}
      {!isInteractive && <div className="absolute inset-0 cursor-default" />}
    </div>
  );
}
