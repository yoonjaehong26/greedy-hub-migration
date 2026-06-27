'use client';

import { useState } from 'react';
import { useSitesQuery } from '@/shared/core/queries/siteQueries';
import { RegisterModal } from '@/features/register/RegisterModal';
import { SiteCard } from './SiteCard';
import { useFeedColumns } from './useFeedColumns';

export function FeedGrid() {
  const { data: sites, isLoading, isError } = useSitesQuery();
  const columns = useFeedColumns();
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-dvh bg-[var(--c-bg)]">
      <main className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-[var(--c-text)]">쇼케이스</h1>
          <button
            onClick={() => setShowRegister(true)}
            className="bg-brand text-white border-none rounded-lg py-[0.4rem] px-[0.875rem] text-sm font-semibold cursor-pointer font-[inherit] transition-[background] duration-150 hover:bg-brand-soft"
          >
            + 등록
          </button>
        </div>
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

      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </div>
  );
}
