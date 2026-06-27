'use client';

import { useMissionsQuery } from '@/shared/core/queries/missionQueries';

const STATE_DOT: Record<string, string> = {
  open:   'bg-brand',
  merged: 'bg-emerald-500',
  closed: 'bg-slate-400',
};

const STATE_LABEL: Record<string, string> = {
  open:   '열림',
  merged: '머지',
  closed: '닫힘',
};

export function RecentActivity() {
  const { data: missions = [], isLoading } = useMissionsQuery();
  const recent = missions.slice(0, 10);

  if (isLoading) return <div className="text-slate-500 text-sm py-4">불러오는 중...</div>;

  return (
    <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-900/5 dark:border-white/10">
        <h2 className="font-semibold">최근 활동</h2>
      </div>
      {recent.length === 0 ? (
        <p className="px-5 py-6 text-sm text-slate-400">최근 활동이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-slate-900/5 dark:divide-white/5">
          {recent.map((m) => (
            <li key={m.id} className="px-5 py-3.5 flex items-start gap-3">
              <span
                className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${STATE_DOT[m.state] ?? 'bg-slate-400'}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    @{m.author}
                  </span>
                  <span className="text-xs text-slate-400">{STATE_LABEL[m.state]}</span>
                </div>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-brand truncate block mt-0.5"
                >
                  {m.title}
                </a>
              </div>
              <span className="shrink-0 text-xs text-slate-400 mt-0.5">
                {new Date(m.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
