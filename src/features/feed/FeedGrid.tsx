'use client';

import { useSitesQuery } from '@/shared/core/queries/siteQueries';
import { useThemeStore } from '@/shared/core/stores/themeStore';
import { SiteCard } from './SiteCard';
import { useFeedColumns } from './useFeedColumns';

export function FeedGrid() {
  const { data: sites, isLoading, isError } = useSitesQuery();
  const toggle = useThemeStore((s) => s.toggle);
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const columns = useFeedColumns();

  return (
    <div className="min-h-dvh bg-[var(--c-bg)]">
      <header className="sticky top-0 z-10 bg-[var(--c-surface)] border-b border-[var(--c-border)] px-6 h-14 flex items-center justify-between backdrop-blur">
        <span className="text-lg font-bold text-brand tracking-tight">Greedy Hub</span>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            title="테마 전환"
            className="bg-transparent border-none cursor-pointer text-lg p-1 rounded-md leading-none hover:bg-[var(--c-border)]"
          >
            {colorScheme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            disabled
            title="등록 기능 준비 중"
            className="bg-brand text-white border-none rounded-lg py-[0.4rem] px-[0.875rem] text-sm font-semibold cursor-pointer font-[inherit] transition-[background] duration-150 [&:not(:disabled):hover]:bg-brand-soft disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + 등록
          </button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 py-6">
        {isLoading && (
          <p className="text-center text-[var(--c-text-sub)] py-12 text-[0.9375rem]">
            불러오는 중…
          </p>
        )}
        {isError && (
          <p className="text-center text-[var(--c-text-sub)] py-12 text-[0.9375rem]">
            목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          </p>
        )}
        {!isLoading && !isError && sites?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-base font-semibold text-[var(--c-text)] mb-2">
              아직 등록된 프로젝트가 없어요
            </p>
            <p className="text-sm text-[var(--c-text-sub)]">첫 번째 프로젝트를 등록해 보세요</p>
          </div>
        )}
        {sites && sites.length > 0 && (
          <div
            className="grid gap-4 items-start"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {sites.map((site, index) => (
              <SiteCard key={site.id} site={site} featured={index === 0 && columns > 1} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
