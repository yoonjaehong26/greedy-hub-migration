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
  const { siteIndex, pageIndex, isInteractive, initSite, setPage, setInteractive } =
    useLiveViewStore();

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

      {/* Shield 토글 — 둘러보기 ↔ 체험 */}
      <button
        type="button"
        onClick={() => setInteractive(!isInteractive)}
        title={isInteractive ? '체험 모드 — 탭해서 둘러보기로 전환' : '둘러보기 모드 — 탭해서 체험 모드로 전환'}
        className={`absolute top-4 right-4 z-20 flex items-center gap-1.5 text-sm font-medium backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm ring-1 transition ${
          isInteractive
            ? 'bg-brand text-white ring-brand/30'
            : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 ring-slate-900/10 dark:ring-white/10 hover:bg-white dark:hover:bg-slate-800'
        }`}
      >
        {isInteractive ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
            </svg>
            체험 중
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            둘러보기
          </>
        )}
      </button>

      {/* iframe 영역 — 하단 MetaStrip 높이(56px) 제외 */}
      <div className="absolute inset-0 bottom-14">
        <LiveCard site={currentSite} page={currentPage} isInteractive={isInteractive} />
      </div>

      {/* 페이지 닷 — MetaStrip 위 */}
      <PageDots
        count={currentSite.pages.length}
        current={pageIndex}
        onSelect={setPage}
      />

      {/* 사이트 메타 정보 */}
      <MetaStrip
        site={currentSite}
        siteIndex={siteIndex}
        siteCount={sites?.length ?? 1}
      />
    </div>
  );
}
