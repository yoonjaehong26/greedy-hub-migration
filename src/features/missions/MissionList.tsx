'use client';

import { useState } from 'react';
import { useMissionsQuery } from '@/shared/core/queries/missionQueries';
import type { Mission } from '@/shared/core/types/mission';

const STATE_CONFIG = {
  open:   { label: '진행 중', cls: 'bg-brand/10 text-brand' },
  merged: { label: '머지됨', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300' },
  closed: { label: '닫힘',   cls: 'bg-slate-200 dark:bg-white/10 text-slate-500' },
};

type StateFilter = 'all' | Mission['state'];

export function MissionList() {
  const { data: missions = [], isLoading, error } = useMissionsQuery();
  const [stateFilter, setStateFilter] = useState<StateFilter>('all');
  const [authorFilter, setAuthorFilter] = useState('');

  const authors = Array.from(new Set(missions.map((m) => m.author))).sort();

  const filtered = missions.filter((m) => {
    if (stateFilter !== 'all' && m.state !== stateFilter) return false;
    if (authorFilter && m.author !== authorFilter) return false;
    return true;
  });

  if (isLoading) return <div className="text-slate-500 py-8 text-center text-sm">불러오는 중...</div>;
  if (error) return <div className="text-red-500 py-8 text-center text-sm">데이터를 가져오지 못했습니다.</div>;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold">PR 목록</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <div className="inline-flex rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 overflow-hidden">
            {(['all', 'open', 'merged', 'closed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStateFilter(s)}
                className={`px-3 py-1.5 transition-colors ${
                  stateFilter === s
                    ? 'bg-brand text-white'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {s === 'all' ? '전체' : STATE_CONFIG[s].label}
              </button>
            ))}
          </div>
          <select
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 bg-white dark:bg-slate-800 text-sm"
          >
            <option value="">모든 멤버</option>
            {authors.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-10">
          해당 조건의 PR이 없습니다.
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((m) => (
            <MissionRow key={m.id} mission={m} />
          ))}
        </ul>
      )}
    </section>
  );
}

function MissionRow({ mission: m }: { mission: Mission }) {
  const s = STATE_CONFIG[m.state];
  const repoShort = m.repository.split('/')[1];

  return (
    <li className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono shrink-0">
            {repoShort}#{m.prNumber}
          </span>
          <a
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-brand truncate"
          >
            {m.title}
          </a>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300">@{m.author}</span>
          {' · '}
          {new Date(m.createdAt).toLocaleDateString('ko-KR')}
          {m.mergedAt && ` · 머지 ${new Date(m.mergedAt).toLocaleDateString('ko-KR')}`}
        </p>
      </div>
      <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>
    </li>
  );
}
