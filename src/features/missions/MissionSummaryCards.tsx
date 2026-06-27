'use client';

import { useMissionsQuery } from '@/shared/core/queries/missionQueries';

export function MissionSummaryCards() {
  const { data: missions = [], isLoading } = useMissionsQuery();

  const total = missions.length;
  const merged = missions.filter((m) => m.state === 'merged').length;
  const open = missions.filter((m) => m.state === 'open').length;
  const authors = new Set(missions.map((m) => m.author)).size;

  const cards = [
    { label: '전체 PR', value: total, sub: '제출됨' },
    { label: '머지 완료', value: merged, sub: `${total > 0 ? Math.round((merged / total) * 100) : 0}%` },
    { label: '진행 중', value: open, sub: 'open PR' },
    { label: '참여 멤버', value: authors, sub: '명' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 px-5 py-4"
        >
          <p className="text-xs text-slate-500 dark:text-slate-400">{c.label}</p>
          <p className={`text-2xl font-bold mt-1 ${isLoading ? 'text-slate-300 dark:text-slate-600' : ''}`}>
            {isLoading ? '—' : c.value}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
