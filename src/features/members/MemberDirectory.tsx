'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMembersQuery } from '@/shared/core/queries/memberQueries';
import type { MemberRoleLabel, Track } from '@/shared/core/types/member';
import { primaryMembership } from './primaryMembership';

type Filter = 'all' | Track;

const CHIP_CLS: Record<MemberRoleLabel, string> = {
  멤버: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300',
  리뷰어: 'bg-brand/10 text-brand',
  리드: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
  메인테이너: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
  OB: 'bg-slate-200 text-slate-500 dark:bg-white/10',
};

export function MemberDirectory() {
  const { data: members = [], isLoading, isError } = useMembersQuery();
  const [filter, setFilter] = useState<Filter>('all');

  const visible = members.filter(
    (m) => filter === 'all' || m.memberships.some((ms) => ms.track === filter),
  );

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">멤버</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300">공개 화면</span>
      </div>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        1~4기 전체 구성원 · 카드를 누르면 개인 이력서로 이동합니다.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        {(['all', 'FE', 'BE'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full ${filter === f ? 'bg-brand text-white' : 'bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10'}`}
          >
            {f === 'all' ? '전체' : f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-10 text-sm text-slate-500 text-center py-10">불러오는 중…</p>
      ) : isError ? (
        <p className="mt-10 text-sm text-red-500 text-center py-10">멤버 목록을 가져오지 못했습니다.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {visible.map((m) => {
            const primary = primaryMembership(m.memberships);
            return (
              <Link
                key={m.id}
                href={`/members/${m.login}`}
                title={`${m.name} 이력서 보기`}
                className="flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-4 hover:-translate-y-0.5 transition"
              >
                <div className="w-11 h-11 rounded-full bg-slate-300 dark:bg-white/20 grid place-items-center font-bold shrink-0">
                  {m.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold">{m.name}</div>
                  {primary && (
                    <>
                      <div className="text-xs text-slate-500">
                        {primary.track} · {primary.cohort}기
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {primary.roles.map((r) => (
                          <span key={r} className={`text-[10px] px-1.5 py-0.5 rounded-full ${CHIP_CLS[r]}`}>
                            {r}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">
        미션 대시보드 로스터 기준 — 1~4기 스터디원 {members.length}명(역할은 리드·리뷰어·메인테이너 구분 없이 전부 &quot;멤버&quot;로 표시 — 미션 대시보드 범위 밖)
      </p>
    </main>
  );
}
