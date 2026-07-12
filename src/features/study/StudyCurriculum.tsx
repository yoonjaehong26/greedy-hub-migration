'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCurriculumQuery } from '@/shared/core/queries/studyQueries';
import { Tab } from '@/shared/components/ui/Tab';
import { Badge } from '@/shared/components/ui/Badge';
import { Card } from '@/shared/components/ui/Card';
import type { CurriculumStage, Track, WeekStatus } from '@/shared/core/types/study';

const TRACK_TABS = [
  { value: 'FE' as Track, label: '프론트엔드' },
  { value: 'BE' as Track, label: '백엔드' },
];

const RHYTHM_STEPS = [
  { title: '미션 받기', lines: ['금요일에 이번 주', '미션이 나와요'] },
  { title: '구현', lines: ['다음 주 화요일까지', '각자 구현해요'] },
  { title: '티키타카 리뷰', lines: ['리뷰어와 며칠간', '주고받으며 다듬어요'] },
  { title: '머지', lines: ['리뷰가 끝나면 머지,', '한 주가 완성돼요'] },
];

const WEEK_STATUS: Record<WeekStatus, { label: string; cls: string }> = {
  DONE: { label: '완료', cls: 'bg-neutral-100 text-neutral-500' },
  ACTIVE: { label: '진행 중', cls: 'bg-brand-50 text-brand-700' },
  UPCOMING: { label: '예정', cls: 'bg-neutral-100 text-neutral-400' },
  BREAK: { label: '쉬는 주', cls: 'bg-neutral-100 text-neutral-400' },
};

function StageCard({ stage, isLast }: { stage: CurriculumStage; isLast: boolean }) {
  return (
    <div className="flex items-start gap-6">
      <div className="flex w-[90px] shrink-0 items-center justify-end pt-0.5">
        <span className="text-sm text-neutral-500">{stage.weekRangeLabel}</span>
      </div>
      <div className="flex shrink-0 flex-col items-center">
        <span className="size-3 shrink-0 rounded-full bg-brand" />
        {!isLast && <span className="w-0.5 flex-1 min-h-[36px] bg-neutral-200" />}
      </div>
      <Card className="mb-6 flex flex-1 flex-col gap-2 !p-6">
        <p className="text-lg text-neutral-900">{stage.title}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand">미션</Badge>
          <span className="text-[15px] text-neutral-900">{stage.missionName}</span>
        </div>
        <p className="text-sm text-neutral-500">{stage.description}</p>

        {(stage.techTags.length > 0 || stage.externalLinks.length > 0) && (
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {stage.techTags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
            {stage.externalLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-[13px] font-semibold text-brand hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="mt-1 flex flex-wrap gap-2">
          {stage.weeks.map((week) => {
            const s = WEEK_STATUS[week.status];
            const content = (
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${s.cls}`}>
                {week.weekLabel} · {s.label}
              </span>
            );
            return week.linkedMissionId ? (
              <Link key={week.id} href={`/missions/${week.linkedMissionId}`} className="hover:opacity-80">
                {content}
              </Link>
            ) : (
              <span key={week.id}>{content}</span>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export function StudyCurriculum() {
  const [track, setTrack] = useState<Track>('FE');
  const { data, isLoading, isError } = useCurriculumQuery();

  const stages = data?.stages ?? [];
  const trackIntros = data?.trackIntros ?? [];

  const visibleStages = stages.filter((s) => s.track === track).sort((a, b) => a.order - b.order);
  const intro = trackIntros.find((t) => t.track === track);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">스터디</h1>
        <p className="text-base text-neutral-500">매주 미션을 만들고, 리뷰로 다듬으며 성장해요.</p>
      </div>

      <Tab items={TRACK_TABS} value={track} onChange={setTrack} className="mt-8" />

      {isLoading ? (
        <p className="mt-10 py-10 text-center text-sm text-neutral-500">불러오는 중…</p>
      ) : isError ? (
        <p className="mt-10 py-10 text-center text-sm text-red-500">커리큘럼을 가져오지 못했습니다.</p>
      ) : (
        <>
          {intro && (
            <section className="flex flex-col gap-4 py-12">
              <h2 className="text-2xl text-neutral-900">{intro.title}</h2>
              <div className="flex flex-col text-base text-neutral-700">
                {intro.description.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {intro.techTags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          <section className="flex flex-col gap-5 py-12">
            <h2 className="text-2xl text-neutral-900">한 주의 리듬</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {RHYTHM_STEPS.map((step, i) => (
                <Card key={step.title} className="flex flex-col gap-3 !bg-neutral-50 !p-6">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-50 text-[15px] text-brand-700">
                    {i + 1}
                  </span>
                  <p className="text-lg text-neutral-900">{step.title}</p>
                  <div className="flex flex-col text-sm text-neutral-500">
                    {step.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-5 py-12">
            <h2 className="text-2xl text-neutral-900">주차별 커리큘럼</h2>
            <div className="flex flex-col">
              {visibleStages.map((stage, i) => (
                <StageCard key={stage.id} stage={stage} isLast={i === visibleStages.length - 1} />
              ))}
            </div>
            <p className="text-[13px] text-neutral-500">커리큘럼은 기수마다 조금씩 달라져요. 4기 기준이에요.</p>
          </section>
        </>
      )}
    </main>
  );
}
