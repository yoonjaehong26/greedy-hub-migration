'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMemberQuery } from '@/shared/core/queries/memberQueries';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { ROLE_BADGE_VARIANT, TRACK_LABEL } from '@/features/members/roleBadge';
import { COHORTS } from '@/shared/core/constants/cohorts';

const PREVIEW_LIMIT = 2;
const HISTORY_PREVIEW_LIMIT = 2;

function githubUrl(login: string) {
  return `https://github.com/${login}`;
}

/** 기수 종료 학기 기준 연도. cohorts 상수에 없는 기수는 표기 생략. */
function cohortYear(cohort: number): string | null {
  const c = COHORTS[cohort as keyof typeof COHORTS];
  return c ? c.endDate.slice(0, 4) : null;
}

export function MemberProfile({ id }: { id: string }) {
  const { data: member, isLoading, isError } = useMemberQuery(id);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  if (isLoading) {
    return <main className="mx-auto max-w-6xl px-5 py-10 text-sm text-neutral-500 text-center">불러오는 중…</main>;
  }

  if (isError || !member) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-10">
        <Link href="/members" className="text-sm text-neutral-500 hover:text-brand">
          ← 멤버 디렉토리
        </Link>
        <p className="mt-6 text-sm text-red-500">멤버를 찾을 수 없습니다.</p>
      </main>
    );
  }

  const sortedMemberships = [...member.memberships].sort((a, b) => b.cohort - a.cohort);
  const visibleMemberships = showAllHistory
    ? sortedMemberships
    : sortedMemberships.slice(0, HISTORY_PREVIEW_LIMIT);
  const hiddenHistoryCount = sortedMemberships.length - visibleMemberships.length;
  const visibleProjects = showAllProjects ? member.teamProjects : member.teamProjects.slice(0, PREVIEW_LIMIT);
  const hiddenProjectCount = member.teamProjects.length - visibleProjects.length;
  const visibleActivities = showAllActivities ? member.activities : member.activities.slice(0, PREVIEW_LIMIT);
  const hiddenActivityCount = member.activities.length - visibleActivities.length;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <Link href="/members" className="text-sm text-brand">
        ← 멤버로
      </Link>

      <div className="mt-6 flex flex-col gap-12 md:flex-row md:items-start">
        {/* 사이드 */}
        <div className="flex w-full flex-col items-center gap-4 text-center md:w-[300px] md:shrink-0 md:items-start md:text-left">
          <Avatar src={member.avatarUrl} name={member.name} size={96} />

          <h1 className="text-2xl font-bold text-neutral-900">{member.name}</h1>

          {member.bio && <p className="text-sm text-neutral-600">{member.bio}</p>}

          {sortedMemberships.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 md:justify-start">
              {(() => {
                const top = sortedMemberships[0];
                return (
                  <>
                    <Badge variant="outline">{top.cohort}기</Badge>
                    <Badge variant="outline">{top.track}</Badge>
                    {top.roles.map((r) => (
                      <Badge key={r} variant={ROLE_BADGE_VARIANT[r]}>
                        {r}
                      </Badge>
                    ))}
                  </>
                );
              })()}
            </div>
          )}

          <Button
            href={githubUrl(member.login)}
            target="_blank"
            rel="noreferrer"
            variant="ghost"
            className="w-full border-[1.5px] border-brand text-brand hover:bg-brand-50"
          >
            GitHub 보기
          </Button>
        </div>

        {/* 기록 */}
        <div className="flex w-full min-w-0 flex-col gap-10">
          {/* 활동 이력 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-neutral-900">활동 이력</h2>
            {sortedMemberships.length === 0 ? (
              <p className="text-sm text-neutral-400">아직 이력이 없습니다.</p>
            ) : (
              <>
                {visibleMemberships.map((ms) => {
                  const year = cohortYear(ms.cohort);
                  return (
                    <div
                      key={`${ms.cohort}-${ms.track}`}
                      className="flex flex-wrap items-center gap-4 rounded-xl border border-neutral-200 px-6 py-[18px]"
                    >
                      <Badge variant="neutral">{ms.cohort}기</Badge>
                      <span className="text-base text-neutral-900">
                        {TRACK_LABEL[ms.track]} {ms.roles.join('·')}
                      </span>
                      {ms.team && <span className="text-sm text-neutral-500">{ms.team}</span>}
                      {year && <span className="ml-auto text-sm text-neutral-400">{year}</span>}
                    </div>
                  );
                })}
                {hiddenHistoryCount > 0 && (
                  <button
                    onClick={() => setShowAllHistory(true)}
                    className="self-start text-sm font-medium text-neutral-500 hover:text-brand"
                  >
                    이전 이력 {hiddenHistoryCount}개 보기
                  </button>
                )}
              </>
            )}
          </section>

          {/* 프로젝트 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-neutral-900">프로젝트</h2>
            {member.teamProjects.length === 0 ? (
              <p className="text-sm text-neutral-400">아직 참여한 팀 프로젝트가 없습니다.</p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {visibleProjects.map((p) => (
                  <Link
                    key={p.projectId}
                    href={`/projects/${p.projectId}`}
                    className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 p-4 hover:bg-neutral-50 sm:w-[calc(50%-8px)]"
                  >
                    <div className="w-[120px] shrink-0">
                      <ImagePlaceholder />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[15px] text-neutral-900">{p.name}</div>
                      <div className="text-[13px] text-neutral-500">{p.roleLabel}</div>
                    </div>
                  </Link>
                ))}
                {hiddenProjectCount > 0 && (
                  <button
                    onClick={() => setShowAllProjects(true)}
                    className="flex w-full items-center justify-center rounded-xl bg-neutral-50 py-[46px] text-sm font-medium text-neutral-700 sm:w-[200px]"
                  >
                    +{hiddenProjectCount} 모두 보기
                  </button>
                )}
              </div>
            )}
          </section>

          {/* 참여한 활동 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-neutral-900">참여한 활동</h2>
            {member.activities.length === 0 ? (
              <p className="text-sm text-neutral-400">아직 참여한 활동이 없습니다.</p>
            ) : (
              <div className="flex flex-wrap gap-6">
                {visibleActivities.map((a) => (
                  <Link
                    key={a.activityId}
                    href={`/gallery/${a.activityId}`}
                    className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 p-4 hover:bg-neutral-50 sm:w-[calc(50%-12px)]"
                  >
                    <div className="w-[120px] shrink-0">
                      <ImagePlaceholder />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[15px] text-neutral-900">{a.title}</div>
                      <div className="text-[13px] text-neutral-500">{a.date}</div>
                    </div>
                  </Link>
                ))}
                {hiddenActivityCount > 0 && (
                  <button
                    onClick={() => setShowAllActivities(true)}
                    className="flex w-full items-center justify-center rounded-xl bg-neutral-50 py-[46px] text-sm font-medium text-neutral-700 sm:w-[200px]"
                  >
                    +{hiddenActivityCount} 모두 보기
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
