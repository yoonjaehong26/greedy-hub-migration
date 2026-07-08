'use client';

import Link from 'next/link';
import { useMemberQuery } from '@/shared/core/queries/memberQueries';

export function MemberProfile({ id }: { id: string }) {
  const { data: member, isLoading, isError } = useMemberQuery(id);

  if (isLoading) {
    return <main className="mx-auto max-w-5xl px-5 py-10 text-sm text-slate-500 text-center">불러오는 중…</main>;
  }

  if (isError || !member) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-10">
        <Link href="/members" className="text-sm text-slate-500 hover:text-brand">
          ← 멤버 디렉토리
        </Link>
        <p className="mt-6 text-sm text-red-500">멤버를 찾을 수 없습니다.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <Link href="/members" className="text-sm text-slate-500 hover:text-brand">
        ← 멤버 디렉토리
      </Link>

      {/* 프로필 헤더 */}
      <div className="mt-3 rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-slate-300 dark:bg-white/20 grid place-items-center text-2xl font-bold">
            {member.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{member.name}</h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300">공개 화면</span>
            </div>
            <div className="text-slate-500 mt-0.5">@{member.login} · {member.school}</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300 font-medium">
                {member.track} {member.cohort}기 · {member.roles[0]}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 text-sm">
            <button className="px-3 py-2 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/15 font-semibold">
              편집
            </button>
          </div>
        </div>
        {member.bio && (
          <p className="mt-5 text-slate-600 dark:text-slate-300">
            {member.bio} 이 페이지는 활동이 쌓이며 <b>자동으로 갱신</b>됩니다.
          </p>
        )}
      </div>

      {/* 통계 */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { value: member.stats.completedMissions, label: '완료 미션', cls: 'text-brand' },
          { value: member.stats.teamProjects, label: '팀 프로젝트', cls: '' },
          { value: member.stats.blogPosts, label: '기술 글', cls: '' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-5 text-center"
          >
            <div className={`text-3xl font-bold ${s.cls}`}>{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* 활동 */}
        <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6 md:col-span-2">
          <h2 className="font-bold mb-1">참여한 활동</h2>
          <p className="text-xs text-slate-400 mb-4">활동에 멘션되면 자동으로 모입니다</p>
          {member.activities.length === 0 ? (
            <p className="text-sm text-slate-400">아직 참여한 활동이 없습니다.</p>
          ) : (
            <div className="grid sm:grid-cols-3 gap-3">
              {member.activities.map((a) => (
                <Link
                  key={a.activityId}
                  href={`/gallery/${a.activityId}`}
                  className="rounded-xl ring-1 ring-slate-900/5 dark:ring-white/10 p-4 hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  <div className="text-xs text-slate-500">
                    {a.date} · <span className="text-brand">{a.tag}</span>
                  </div>
                  <div className="font-medium mt-0.5">{a.title}</div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 팀 프로젝트 */}
        <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6 md:col-span-2">
          <h2 className="font-bold mb-4">팀 프로젝트</h2>
          {member.teamProjects.length === 0 ? (
            <p className="text-sm text-slate-400">아직 참여한 팀 프로젝트가 없습니다.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {member.teamProjects.map((p) => (
                <Link
                  key={p.projectId}
                  href={`/projects/${p.projectId}`}
                  className="flex gap-3 p-3 rounded-xl ring-1 ring-slate-900/5 dark:ring-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-brand/30 to-slate-300 dark:to-slate-700" />
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-slate-500">{p.roleLabel}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
