'use client';

import { useStatsQuery } from '@/shared/core/queries/statsQueries';

export function HomeStats() {
  const { data, isLoading } = useStatsQuery();

  const items = [
    { label: '누적 멤버', value: isLoading || !data ? '—' : `${data.totalMembers}` },
    { label: '진행 기수', value: isLoading || !data ? '—' : `${data.activeCohort}기` },
    { label: '트랙', value: isLoading || !data ? '—' : data.tracks },
    { label: '팀 프로젝트', value: isLoading || !data ? '—' : `${data.teamProjects}` },
  ];

  return (
    <dl className="flex flex-wrap items-center justify-center gap-x-16 gap-y-6 bg-neutral-50 py-14 dark:bg-slate-800/40">
      {items.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-1">
          <dd className="text-3xl font-bold text-brand">{s.value}</dd>
          <dt className="text-sm text-neutral-500 dark:text-slate-400">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}
