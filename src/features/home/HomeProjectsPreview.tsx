'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProjectsQuery } from '@/shared/core/queries/projectQueries';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { Badge } from '@/shared/components/ui/Badge';

const PAGE_SIZE = 3;

export function HomeProjectsPreview() {
  const { data: projects = [], isLoading } = useProjectsQuery();
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const visible = projects.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-slate-100">프로젝트</h2>
        <Link href="/projects" className="text-sm font-semibold text-brand">
          더보기
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-500">불러오는 중…</p>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="flex w-full items-center gap-4">
            <button
              type="button"
              aria-label="이전"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 disabled:opacity-30 sm:flex"
            >
              ←
            </button>

            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
              {visible.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex flex-col gap-3 rounded-[20px] border border-neutral-200 p-4 transition hover:-translate-y-0.5 dark:border-white/10"
                >
                  <ImagePlaceholder src={p.thumbnailUrl} alt={p.name} />
                  <Badge variant="brand" className="w-fit">
                    {p.cohortLabel}
                  </Badge>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-slate-100">{p.name}</p>
                  <p className="text-sm text-neutral-500 dark:text-slate-400">{p.description}</p>
                </Link>
              ))}
            </div>

            <button
              type="button"
              aria-label="다음"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 disabled:opacity-30 sm:flex"
            >
              →
            </button>
          </div>

          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`${i + 1}번째 페이지`}
                  onClick={() => setPage(i)}
                  className={`size-2 rounded-full ${i === page ? 'bg-brand' : 'bg-neutral-300'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
