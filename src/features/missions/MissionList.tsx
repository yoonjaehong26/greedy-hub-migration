'use client';

import { useState } from 'react';
import { useMissionsQuery } from '@/shared/core/queries/missionQueries';
import type { Mission } from '@/shared/core/types/mission';

const STATE_CONFIG = {
  open:   { label: '진행 중', pillCls: 'bg-brand/10 text-brand' },
  merged: { label: '머지됨',  pillCls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300' },
  closed: { label: '닫힘',    pillCls: 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400' },
} as const;

type StateFilter = 'all' | Mission['state'];

const FILTER_TABS: { key: StateFilter; label: string }[] = [
  { key: 'all',    label: '전체' },
  { key: 'open',   label: '진행 중' },
  { key: 'merged', label: '머지됨' },
  { key: 'closed', label: '닫힘' },
];

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

  return (
    <section>
      {/* 섹션 헤더 + 필터 */}
      <div className="mt-9 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">최근 PR</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          {/* 상태 토글 — admin.html inline-flex ring 스타일 */}
          <div className="inline-flex rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 overflow-hidden">
            {FILTER_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStateFilter(key)}
                className={`px-3 py-1.5 transition-colors ${
                  stateFilter === key
                    ? 'bg-brand text-white'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {/* 멤버 필터 */}
          <select
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 bg-white dark:bg-slate-800 text-sm"
          >
            <option value="">모든 멤버</option>
            {authors.map((a) => (
              <option key={a} value={a}>
                @{a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 목록 */}
      {isLoading ? (
        <p className="mt-3 text-slate-500 py-8 text-center text-sm">불러오는 중…</p>
      ) : error ? (
        <p className="mt-3 text-red-500 py-8 text-center text-sm">데이터를 가져오지 못했습니다.</p>
      ) : filtered.length === 0 ? (
        <p className="mt-3 text-slate-400 text-sm text-center py-10">해당 조건의 PR이 없습니다.</p>
      ) : (
        <div className="mt-3 rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 divide-y divide-slate-100 dark:divide-white/10">
          {filtered.map((m) => (
            <MissionRow key={m.id} mission={m} />
          ))}
        </div>
      )}
    </section>
  );
}

function MissionRow({ mission: m }: { mission: Mission }) {
  const s = STATE_CONFIG[m.state] ?? STATE_CONFIG.closed;
  const repoShort = m.repository.split('/')[1] ?? m.repository;

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
      {/* 상태 pill */}
      <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${s.pillCls}`}>
        {s.label}
      </span>

      {/* 제목 + 메타 */}
      <div className="min-w-0 flex-1">
        <a
          href={m.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold truncate block hover:text-brand transition-colors"
        >
          {m.title}
        </a>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          @{m.author}
          {' · '}
          {new Date(m.createdAt).toLocaleDateString('ko-KR')}
          {m.mergedAt && ` · 머지 ${new Date(m.mergedAt).toLocaleDateString('ko-KR')}`}
        </p>
      </div>

      {/* 레포 */}
      <span className="hidden sm:inline text-xs text-slate-400 whitespace-nowrap font-mono">
        {repoShort}#{m.prNumber}
      </span>

      {/* PR 링크 */}
      <a
        href={m.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:inline text-sm text-slate-400 hover:text-brand whitespace-nowrap"
      >
        PR #{m.prNumber} →
      </a>
    </div>
  );
}
