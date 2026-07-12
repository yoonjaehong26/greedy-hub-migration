'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useProjectQuery, useProjectsQuery } from '@/shared/core/queries/projectQueries';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';

const GALLERY_TILE_COUNT = 4;

const STORY_BLOCKS = [
  { key: 'problem', label: '어떤 문제를 풀었나요' },
  { key: 'features', label: '주요 기능' },
  { key: 'how', label: '어떻게 만들었나요' },
] as const;

export function ProjectDetail({ id }: { id: string }) {
  const { data: project, isLoading, isError } = useProjectQuery(id);
  const { data: projects = [] } = useProjectsQuery();

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

  const currentIndex = projects.findIndex((p) => String(p.id) === String(project.id));
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : undefined;
  const nextProject =
    currentIndex >= 0 && currentIndex < projects.length - 1 ? projects[currentIndex + 1] : undefined;

  const screenshots = project.screenshots ?? [];
  const hasGalleryOverflow = screenshots.length > GALLERY_TILE_COUNT;
  const galleryTiles = hasGalleryOverflow
    ? screenshots.slice(0, GALLERY_TILE_COUNT - 1)
    : screenshots;
  const galleryOverflowCount = screenshots.length - galleryTiles.length;

  const stories = STORY_BLOCKS.map((b) => ({ ...b, text: project[b.key] })).filter(
    (b): b is typeof b & { text: string } => Boolean(b.text),
  );

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
                <Button href={project.githubUrl} variant="outline-brand" size="md">
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

      {stories.length > 0 && (
        <div className="mt-12 flex flex-col gap-8">
          {stories.map((s) => (
            <section key={s.key} className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-slate-100">{s.label}</h2>
              <p className="text-base leading-relaxed text-neutral-600 dark:text-slate-300">
                {s.text}
              </p>
            </section>
          ))}
        </div>
      )}

      {screenshots.length > 0 && (
        <section className="mt-12 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-slate-100">화면</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {galleryTiles.map((src, i) => (
              <ImagePlaceholder key={i} src={src} alt={`${project.name} 화면 ${i + 1}`} />
            ))}
            {hasGalleryOverflow && (
              <div className="relative">
                <ImagePlaceholder src={screenshots[GALLERY_TILE_COUNT - 1]} alt={project.name} />
                <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 text-sm font-semibold text-white">
                  +{galleryOverflowCount} 모두 보기
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-1 text-lg font-bold text-neutral-900 dark:text-slate-100">함께 만든 사람들</h2>
          <p className="mb-4 text-[13px] text-neutral-500">이름을 누르면 멤버 프로필로 이동해요.</p>
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

      {(prevProject || nextProject) && (
        <nav className="mt-12 grid grid-cols-1 gap-4 border-t border-neutral-200 pt-8 sm:grid-cols-2">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.id}`}
              className="flex flex-col gap-1 rounded-[20px] border border-neutral-200 p-4 hover:border-brand/40"
            >
              <span className="text-[13px] text-neutral-400">이전 프로젝트</span>
              <span className="font-semibold text-neutral-900 dark:text-slate-100">{prevProject.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {nextProject && (
            <Link
              href={`/projects/${nextProject.id}`}
              className="flex flex-col gap-1 rounded-[20px] border border-neutral-200 p-4 text-right hover:border-brand/40 sm:items-end"
            >
              <span className="text-[13px] text-neutral-400">다음 프로젝트</span>
              <span className="font-semibold text-neutral-900 dark:text-slate-100">{nextProject.name}</span>
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
