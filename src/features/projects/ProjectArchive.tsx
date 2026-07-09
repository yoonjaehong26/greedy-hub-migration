'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProjectsQuery } from '@/shared/core/queries/projectQueries';

const FILTERS = ['전체', '4기', '3기', 'FE', 'BE'];

export function ProjectArchive() {
  const [filter, setFilter] = useState('전체');
  const { data: projects = [], isLoading, isError } = useProjectsQuery();

  const visible =
    filter === '전체' ? projects : projects.filter((p) => p.cohortLabel === filter || p.trackLabel === filter);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">팀 프로젝트 아카이브</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300">공개 화면</span>
      </div>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        스터디 이후 팀을 꾸려 만든 결과물 · 데모데이 발표작.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full ${filter === f ? 'bg-brand text-white' : 'bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-10 text-sm text-slate-500 text-center py-10">불러오는 중…</p>
      ) : isError ? (
        <p className="mt-10 text-sm text-red-500 text-center py-10">프로젝트 목록을 가져오지 못했습니다.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-5">
          {visible.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="block rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden hover:-translate-y-0.5 transition"
            >
              <div
                className="h-32"
                style={{ background: `linear-gradient(135deg, ${p.thumbnailColor}cc, ${p.thumbnailColor}33)` }}
              />
              <div className="p-5">
                <div className="text-xs text-slate-500">{p.cohortLabel} · {p.trackLabel}</div>
                <h3 className="mt-1 font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{p.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>👥 {p.teamSize}명</span>
                  <span className="text-brand font-medium">상세 →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
