'use client';

import { useMissionsQuery } from '@/shared/core/queries/missionQueries';
import type { RepoMissionStats } from '@/shared/core/types/mission';

function computeRepoStats(missions: ReturnType<typeof useMissionsQuery>['data']): RepoMissionStats[] {
  if (!missions) return [];
  const map = new Map<string, RepoMissionStats>();

  for (const m of missions) {
    const prev = map.get(m.repository) ?? {
      repository: m.repository,
      totalPRs: 0,
      uniqueAuthors: 0,
      merged: 0,
    };
    prev.totalPRs++;
    if (m.state === 'merged') prev.merged++;
    map.set(m.repository, prev);
  }

  // 고유 author 수 계산
  for (const repo of map.keys()) {
    const authors = new Set(missions.filter((m) => m.repository === repo).map((m) => m.author));
    const entry = map.get(repo)!;
    entry.uniqueAuthors = authors.size;
    map.set(repo, entry);
  }

  return Array.from(map.values()).sort((a, b) => b.totalPRs - a.totalPRs);
}

export function RepoStats() {
  const { data: missions, isLoading } = useMissionsQuery();
  const stats = computeRepoStats(missions);

  if (isLoading) return null;

  return (
    <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-900/5 dark:border-white/10">
        <h2 className="font-semibold">레포별 참여 현황</h2>
      </div>
      {stats.length === 0 ? (
        <p className="px-5 py-6 text-sm text-slate-400">데이터가 없습니다.</p>
      ) : (
        <ul className="divide-y divide-slate-900/5 dark:divide-white/5">
          {stats.map((s) => {
            const mergeRate = s.totalPRs > 0 ? Math.round((s.merged / s.totalPRs) * 100) : 0;
            return (
              <li key={s.repository} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{s.repository}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    참여 {s.uniqueAuthors}명 · 전체 {s.totalPRs}건
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {s.merged}건 머지
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-20 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${mergeRate}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{mergeRate}%</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
