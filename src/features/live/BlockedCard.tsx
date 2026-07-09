import type { Site } from '@/shared/core/types/site';

interface Props {
  site: Site;
}

export function BlockedCard({ site }: Props) {
  const homeUrl = site.pages.find((p) => p.isHome)?.url ?? site.pages[0]?.url ?? '#';

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5 bg-slate-50 dark:bg-slate-900">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: `${site.thumbnailColor}20` }}
      >
        <svg
          className="w-8 h-8 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
          />
        </svg>
      </div>

      <div className="text-center px-8">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{site.title}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          이 사이트는 임베드를 허용하지 않아요
        </p>
        <a
          href={homeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          새 탭에서 열기
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
