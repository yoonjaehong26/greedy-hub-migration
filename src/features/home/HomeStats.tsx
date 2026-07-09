'use client';

import { useStatsQuery } from '@/shared/core/queries/statsQueries';

export function HomeStats() {
  const { data, isLoading } = useStatsQuery();

  const items = [
    { label: '누적 멤버', value: isLoading || !data ? '—' : `~${data.totalMembers}` },
    { label: '진행 기수', value: isLoading || !data ? '—' : `${data.activeCohort}기` },
    { label: '트랙', value: isLoading || !data ? '—' : data.tracks },
    { label: '팀 프로젝트', value: isLoading || !data ? '—' : `${data.teamProjects}+` },
  ];

  return (
    <dl className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-5"
        >
          <dt className="text-sm text-slate-500">{s.label}</dt>
          <dd className="mt-1 text-3xl font-bold">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
