'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useProjectsQuery } from '@/shared/core/queries/projectQueries';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { Badge } from '@/shared/components/ui/Badge';
import { Tab } from '@/shared/components/ui/Tab';

const ALL_COHORT = '전체';

function cohortSortKey(label: string) {
  const match = label.match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

export function ProjectArchive() {
  const { data: projects = [], isLoading, isError } = useProjectsQuery();
  const [cohort, setCohort] = useState(ALL_COHORT);

  const cohortTabs = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.cohortLabel)));
    unique.sort((a, b) => cohortSortKey(a) - cohortSortKey(b));
    return [ALL_COHORT, ...unique];
  }, [projects]);

  const visible = cohort === ALL_COHORT ? projects : projects.filter((p) => p.cohortLabel === cohort);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">프로젝트</h1>
        <p className="text-base text-neutral-500">매 기수, 팀을 꾸려 실제로 만든 것들이에요.</p>
      </div>

      <Tab
        items={cohortTabs.map((c) => ({ value: c, label: c }))}
        value={cohort}
        onChange={setCohort}
        className="mt-8"
      />

      {isLoading ? (
        <p className="mt-10 py-10 text-center text-sm text-neutral-500">불러오는 중…</p>
      ) : isError ? (
        <p className="mt-10 py-10 text-center text-sm text-red-500">프로젝트 목록을 가져오지 못했습니다.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="flex flex-col gap-3 rounded-[20px] border border-neutral-200 p-6 transition hover:-translate-y-0.5 dark:border-white/10"
            >
              <ImagePlaceholder src={p.thumbnailUrl} alt={p.name} />
              <Badge variant="brand" className="w-fit">
                {p.cohortLabel}
              </Badge>
              <p className="text-lg font-semibold text-neutral-900 dark:text-slate-100">{p.name}</p>
              <p className="text-sm text-neutral-500 dark:text-slate-400">{p.description}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
