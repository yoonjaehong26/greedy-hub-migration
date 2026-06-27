import type { Site } from '@/shared/core/types/site';

interface Props {
  site: Site;
  siteIndex: number;
  siteCount: number;
  onPrev: () => void;
  onNext: () => void;
}

export function MetaStrip({ site, siteIndex, siteCount, onPrev, onNext }: Props) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-900/5 dark:border-white/10">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-8 h-8 rounded-lg flex-shrink-0"
          style={{ backgroundColor: site.thumbnailColor }}
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
            {site.title}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{site.domain}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0 ml-4">
        <button
          type="button"
          onClick={onPrev}
          aria-label="이전 사이트"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums w-10 text-center">
          {siteIndex + 1} / {siteCount}
        </span>
        <button
          type="button"
          onClick={onNext}
          aria-label="다음 사이트"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
