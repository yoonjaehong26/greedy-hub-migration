'use client';

import Link from 'next/link';
import { useProjectQuery } from '@/shared/core/queries/projectQueries';

export function ProjectDetail({ id }: { id: string }) {
  const { data: project, isLoading, isError } = useProjectQuery(id);

  if (isLoading) {
    return <main className="mx-auto max-w-4xl px-5 py-10 text-sm text-slate-500 text-center">불러오는 중…</main>;
  }

  if (isError || !project) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-10">
        <Link href="/projects" className="text-sm text-slate-500 hover:text-brand">
          ← 프로젝트
        </Link>
        <p className="mt-6 text-sm text-red-500">프로젝트를 찾을 수 없습니다.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/projects" className="text-sm text-slate-500 hover:text-brand">
        ← 프로젝트
      </Link>

      <div className="mt-4 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
        <div
          className="h-40"
          style={{ background: `linear-gradient(135deg, ${project.thumbnailColor}cc, ${project.thumbnailColor}33)` }}
        />
        <div className="p-6">
          <div className="text-xs text-slate-500">{project.cohortLabel} · {project.trackLabel}</div>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {project.name}
              {project.subtitle && <span className="font-normal text-slate-500"> — {project.subtitle}</span>}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300">공개 화면</span>
          </div>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{project.description}</p>
          {(project.githubUrl || project.liveUrl) && (
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold"
                >
                  GitHub ↗
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/15 font-semibold"
                >
                  라이브 데모 ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6">
          <h2 className="font-bold mb-3">팀원</h2>
          {project.team.length === 0 ? (
            <p className="text-sm text-slate-400">등록된 팀원이 없습니다.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {project.team.map((t) => (
                <li key={`${t.memberId}-${t.name}`}>
                  {t.memberId ? (
                    <Link href={`/members/${t.memberId}`} className="flex items-center gap-2 hover:text-brand">
                      <span className="w-7 h-7 rounded-full bg-slate-300 dark:bg-white/20" />
                      {t.name} · {t.roleLabel}
                    </Link>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-slate-300 dark:bg-white/20" />
                      {t.name} · {t.roleLabel}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6">
          <h2 className="font-bold mb-3">기술 스택</h2>
          {project.stack.length === 0 ? (
            <p className="text-sm text-slate-400">등록된 스택 정보가 없습니다.</p>
          ) : (
            <div className="flex flex-wrap gap-2 text-sm">
              {project.stack.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-white/10">
                  {s}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
