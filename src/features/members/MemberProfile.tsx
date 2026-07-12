'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMemberQuery, useUpdateMemberMutation } from '@/shared/core/queries/memberQueries';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { ROLE_BADGE_VARIANT, TRACK_LABEL } from '@/features/members/roleBadge';

const PREVIEW_LIMIT = 2;

function githubUrl(login: string) {
  return `https://github.com/${login}`;
}

export function MemberProfile({ id }: { id: string }) {
  const { data: member, isLoading, isError } = useMemberQuery(id);
  const updateMember = useUpdateMemberMutation(id);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState('');
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);

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

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-neutral-900">{member.name}</h1>
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600">
              {member.isPublic ? '공개' : '비공개'}
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            @{member.login} · {member.school}
          </p>

          {isEditingBio ? (
            <div className="w-full">
              <textarea
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-neutral-200 p-3 text-sm"
                placeholder="자기소개를 적어보세요"
              />
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Button
                  size="sm"
                  onClick={() => {
                    updateMember.mutate(
                      { bio: bioDraft },
                      { onSuccess: () => setIsEditingBio(false) },
                    );
                  }}
                  disabled={updateMember.isPending}
                >
                  저장
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditingBio(false)}>
                  취소
                </Button>
              </div>
            </div>
          ) : (
            member.bio && <p className="text-sm text-neutral-600">{member.bio}</p>
          )}

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

          <button
            onClick={() => updateMember.mutate({ isPublic: !member.isPublic })}
            disabled={updateMember.isPending}
            className="flex items-center gap-2 text-sm"
          >
            <span
              className={`relative h-6 w-11 rounded-full transition-colors ${member.isPublic ? 'bg-brand' : 'bg-neutral-300'}`}
            >
              <span
                className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                style={{ transform: member.isPublic ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </span>
            <span className="font-medium text-neutral-700">
              {member.isPublic ? '외부 공개' : '비공개'}
            </span>
          </button>

          {!isEditingBio && (
            <button
              onClick={() => {
                setBioDraft(member.bio ?? '');
                setIsEditingBio(true);
              }}
              className="text-sm font-semibold text-neutral-700 underline underline-offset-2"
            >
              자기소개 편집
            </button>
          )}
        </div>

        {/* 기록 */}
        <div className="flex w-full min-w-0 flex-col gap-10">
          {/* 활동 이력 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-neutral-900">활동 이력</h2>
            {sortedMemberships.length === 0 ? (
              <p className="text-sm text-neutral-400">아직 이력이 없습니다.</p>
            ) : (
              sortedMemberships.map((ms) => (
                <div
                  key={`${ms.cohort}-${ms.track}`}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-neutral-200 px-6 py-[18px]"
                >
                  <Badge variant="outline">{ms.cohort}기</Badge>
                  <span className="text-base text-neutral-900">
                    {TRACK_LABEL[ms.track]} {ms.roles.join('·')}
                  </span>
                  {ms.team && <span className="text-sm text-neutral-500">{ms.team}</span>}
                </div>
              ))
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
