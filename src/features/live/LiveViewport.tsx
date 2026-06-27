'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSitesQuery } from '@/shared/core/queries/siteQueries';
import { useLiveViewStore } from '@/shared/core/stores/liveViewStore';
import { useLiveGestures } from '@/shared/lib/hooks/useLiveGestures';
import { LiveCard } from './LiveCard';
import { MetaStrip } from './MetaStrip';
import { PageDots } from './PageDots';

interface Props {
  initialSiteId: string;
}

export function LiveViewport({ initialSiteId }: Props) {
  const router = useRouter();
  const { data: sites, isLoading } = useSitesQuery();
  const { siteIndex, pageIndex, initSite, setPage, nextSite, prevSite } = useLiveViewStore();

  useLiveGestures(sites ?? []);

  useEffect(() => {
    if (!sites) return;
    const idx = sites.findIndex((s) => s.id === initialSiteId);
    initSite(idx >= 0 ? idx : 0, sites.length);
  }, [sites, initialSiteId, initSite]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-slate-400 dark:text-slate-500 text-sm">불러오는 중…</p>
      </div>
    );
  }

  const currentSite = sites?.[siteIndex];
  const currentPage = currentSite?.pages[pageIndex] ?? currentSite?.pages[0];

  if (!currentSite || !currentPage) return null;

  const siteCount = sites?.length ?? 1;

  return (
    <div className="fixed inset-0 bg-slate-100 dark:bg-slate-950">
      {/* 피드로 돌아가기 */}
      <button
        type="button"
        onClick={() => router.push('/showcase')}
        className="absolute top-4 left-4 z-20 flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm ring-1 ring-slate-900/10 dark:ring-white/10 hover:bg-white dark:hover:bg-slate-800 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        피드
      </button>

      {/* iframe 영역 — 하단 MetaStrip 높이(56px) 제외 */}
      <div className="absolute inset-0 bottom-14">
        <LiveCard site={currentSite} page={currentPage} />
      </div>

      {/* 페이지 닷 — MetaStrip 위 */}
      <PageDots
        count={currentSite.pages.length}
        current={pageIndex}
        onSelect={setPage}
      />

      {/* 사이트 메타 + 이전/다음 내비게이션 */}
      <MetaStrip
        site={currentSite}
        siteIndex={siteIndex}
        siteCount={siteCount}
        onPrev={() => prevSite(siteCount)}
        onNext={() => nextSite(siteCount)}
      />
    </div>
  );
}
