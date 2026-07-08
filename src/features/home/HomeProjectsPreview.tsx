'use client';

import Link from 'next/link';
import { useProjectsQuery } from '@/shared/core/queries/projectQueries';

export function HomeProjectsPreview() {
  const { data: projects = [], isLoading } = useProjectsQuery();
  const preview = projects.slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl font-bold leading-snug">기수별 팀 프로젝트</h2>
        <Link href="/projects" className="text-sm font-semibold text-brand hover:underline">
          아카이브 →
        </Link>
      </div>
      {isLoading ? (
        <p className="mt-8 text-sm text-slate-500">불러오는 중…</p>
      ) : (
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {preview.map((p) => (
            <Link
              key={p.id}
              href="/projects"
              className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden hover:-translate-y-0.5 transition"
            >
              <div
                className="h-32"
                style={{ background: `linear-gradient(135deg, ${p.thumbnailColor}cc, ${p.thumbnailColor}33)` }}
              />
              <div className="p-5">
                <div className="text-xs text-slate-500">{p.cohortLabel} · {p.trackLabel}</div>
                <h3 className="mt-1 font-semibold">{p.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
