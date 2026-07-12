'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useProjectQuery } from '@/shared/core/queries/projectQueries';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';

export function ProjectDetail({ id }: { id: string }) {
  const { data: project, isLoading, isError } = useProjectQuery(id);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-16 text-center text-sm text-neutral-500">불러오는 중…</main>
    );
  }

  if (isError || !project) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-10">
        <Link href="/projects" className="text-sm font-medium text-brand hover:underline">
          ← 프로젝트로
        </Link>
        <p className="mt-6 text-sm text-red-500">프로젝트를 찾을 수 없습니다.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:py-14">
      <Link href="/projects" className="text-sm font-medium text-brand hover:underline">
        ← 프로젝트로
      </Link>

      <div className="mt-4 flex flex-col gap-4">
        <Badge variant="brand" className="w-fit">
          {project.cohortLabel}
        </Badge>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl dark:text-slate-100">
            {project.name}
            {project.subtitle && (
              <span className="ml-2 text-lg font-normal text-neutral-500">{project.subtitle}</span>
            )}
          </h1>

          {(project.liveUrl || project.githubUrl) && (
            <div className="flex flex-wrap gap-3">
              {project.liveUrl && (
                <Button href={project.liveUrl} variant="primary" size="md">
                  서비스 보러 가기
                </Button>
              )}
              {project.githubUrl && (
                <Button href={project.githubUrl} variant="outline" size="md">
                  GitHub
                </Button>
              )}
            </div>
          )}
        </div>

        <p className="text-base text-neutral-500 dark:text-slate-400">{project.description}</p>
      </div>

      <div className="mt-8">
        <ImagePlaceholder src={project.thumbnailUrl} alt={project.name} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-slate-100">팀원</h2>
          {project.team.length === 0 ? (
            <p className="text-sm text-neutral-400">등록된 팀원이 없습니다.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {project.team.map((t) => {
                const content: ReactNode = (
                  <>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
                      {t.name.slice(0, 1)}
                    </span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-slate-100">{t.name}</span>
                    <Badge variant="outline">{t.roleLabel}</Badge>
                  </>
                );
                return (
                  <li key={`${t.memberId}-${t.name}`}>
                    {t.memberId ? (
                      <Link
                        href={`/members/${t.memberId}`}
                        className="flex items-center gap-3 hover:text-brand"
                      >
                        {content}
                      </Link>
                    ) : (
                      <span className="flex items-center gap-3">{content}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-slate-100">기술 스택</h2>
          {project.stack.length === 0 ? (
            <p className="text-sm text-neutral-400">등록된 스택 정보가 없습니다.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <Badge key={s} variant="outline">
                  {s}
                </Badge>
              ))}
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
