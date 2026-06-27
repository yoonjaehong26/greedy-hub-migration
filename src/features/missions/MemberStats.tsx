'use client';

import { useMissionsQuery } from '@/shared/core/queries/missionQueries';
import type { MemberMissionStats } from '@/shared/core/types/mission';

function computeMemberStats(missions: ReturnType<typeof useMissionsQuery>['data']): MemberMissionStats[] {
  if (!missions) return [];
  const map = new Map<string, MemberMissionStats>();

  for (const m of missions) {
    const prev = map.get(m.author) ?? { author: m.author, total: 0, merged: 0, open: 0, closed: 0 };
    prev.total++;
    if (m.state === 'merged') prev.merged++;
    else if (m.state === 'open') prev.open++;
    else prev.closed++;
    map.set(m.author, prev);
  }

  return Array.from(map.values()).sort((a, b) => b.merged - a.merged || b.total - a.total);
}

export function MemberStats() {
  const { data: missions, isLoading } = useMissionsQuery();
  const stats = computeMemberStats(missions);

  if (isLoading) return <div className="text-slate-500 text-sm py-4">불러오는 중...</div>;

  return (
    <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-900/5 dark:border-white/10">
        <h2 className="font-semibold">멤버별 현황</h2>
      </div>
      {stats.length === 0 ? (
        <p className="px-5 py-6 text-sm text-slate-400">데이터가 없습니다. GitHub 동기화를 실행해주세요.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-900/5 dark:border-white/10">
              <th className="text-left px-5 py-2.5 font-medium">멤버</th>
              <th className="text-right px-4 py-2.5 font-medium">전체</th>
              <th className="text-right px-4 py-2.5 font-medium text-emerald-600 dark:text-emerald-400">머지</th>
              <th className="text-right px-4 py-2.5 font-medium text-brand">진행</th>
              <th className="text-right px-5 py-2.5 font-medium text-slate-400">닫힘</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/5 dark:divide-white/5">
            {stats.map((s) => (
              <tr key={s.author} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-5 py-3 font-medium">@{s.author}</td>
                <td className="px-4 py-3 text-right">{s.total}</td>
                <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                  {s.merged}
                </td>
                <td className="px-4 py-3 text-right text-brand font-medium">{s.open}</td>
                <td className="px-5 py-3 text-right text-slate-400">{s.closed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
