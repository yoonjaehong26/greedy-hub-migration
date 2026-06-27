'use client';

import { useMissionsQuery } from '@/shared/core/queries/missionQueries';

const CARD_CLS =
  'rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-5';

export function MissionSummaryCards() {
  const { data: missions = [], isLoading } = useMissionsQuery();

  const total   = missions.length;
  const merged  = missions.filter((m) => m.state === 'merged').length;
  const open    = missions.filter((m) => m.state === 'open').length;
  const authors = new Set(missions.map((m) => m.author)).size;

  const cards = [
    { label: '전체 PR',  value: total,   cls: '' },
    { label: '머지됨',   value: merged,  cls: 'text-emerald-600 dark:text-emerald-400' },
    { label: '진행 중',  value: open,    cls: 'text-brand' },
    { label: '참여 멤버', value: authors, cls: '' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className={CARD_CLS}>
          <p className="text-sm text-slate-500 dark:text-slate-400">{c.label}</p>
          <p className={`mt-1 text-3xl font-bold ${isLoading ? 'text-slate-300 dark:text-slate-600' : c.cls}`}>
            {isLoading ? '—' : c.value}
          </p>
        </div>
      ))}
    </div>
  );
}
