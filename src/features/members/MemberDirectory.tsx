'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useMembersQuery } from '@/shared/core/queries/memberQueries';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/Badge';
import { Chip } from '@/shared/components/ui/Chip';
import { Tab } from '@/shared/components/ui/Tab';
import { primaryMembership } from './primaryMembership';
import { memberCohortLabels } from './memberCohortLabels';
import { ROLE_BADGE_VARIANT, STAFF_ROLES } from './roleBadge';

type RoleTrackFilter = 'all' | 'FE' | 'BE' | '운영진' | '리뷰어';

const ROLE_TRACK_CHIPS: { value: RoleTrackFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'FE', label: 'FE' },
  { value: 'BE', label: 'BE' },
  { value: '운영진', label: '운영진' },
  { value: '리뷰어', label: '리뷰어' },
];

function githubUrl(login: string) {
  return `https://github.com/${login}`;
}

export function MemberDirectory() {
  const { data: members = [], isLoading, isError } = useMembersQuery();
  const [cohortValue, setCohortValue] = useState('all');
  const [roleTrackFilter, setRoleTrackFilter] = useState<RoleTrackFilter>('all');

  const cohortTabItems = useMemo(() => {
    const cohorts = new Set<number>();
    members.forEach((m) => m.memberships.forEach((ms) => cohorts.add(ms.cohort)));
    return [
      { value: 'all', label: '전체' },
      ...[...cohorts].sort((a, b) => a - b).map((c) => ({ value: String(c), label: `${c}기` })),
    ];
  }, [members]);

  const visible = members.filter((m) => {
    const matchesCohort =
      cohortValue === 'all' || m.memberships.some((ms) => ms.cohort === Number(cohortValue));

    const matchesRoleTrack =
      roleTrackFilter === 'all'
        ? true
        : roleTrackFilter === 'FE' || roleTrackFilter === 'BE'
          ? m.memberships.some((ms) => ms.track === roleTrackFilter)
          : roleTrackFilter === '운영진'
            ? m.memberships.some((ms) => ms.roles.some((r) => STAFF_ROLES.includes(r)))
            : m.memberships.some((ms) => ms.roles.includes('리뷰어'));

    return matchesCohort && matchesRoleTrack;
  });

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-3xl md:text-[40px] font-bold text-neutral-900">멤버</h1>
      <p className="mt-1 text-neutral-500">그리디를 함께 만들어 온 사람들이에요.</p>

      <div className="mt-8 flex flex-col gap-4">
        <Tab items={cohortTabItems} value={cohortValue} onChange={setCohortValue} />
        <div className="flex flex-wrap gap-2">
          {ROLE_TRACK_CHIPS.map((c) => (
            <Chip
              key={c.value}
              selected={roleTrackFilter === c.value}
              onClick={() => setRoleTrackFilter(c.value)}
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="mt-10 text-sm text-neutral-500 text-center py-10">불러오는 중…</p>
      ) : isError ? (
        <p className="mt-10 text-sm text-red-500 text-center py-10">멤버 목록을 가져오지 못했습니다.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visible.map((m) => {
            const primary = primaryMembership(m.memberships);
            const cohortLabels = memberCohortLabels(m.memberships, m.joinType);
            const roles = primary?.roles ?? [];

            return (
              <div
                key={m.id}
                className="flex flex-col items-center gap-2.5 rounded-[20px] border border-neutral-200 bg-white p-6 text-center transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <Link
                  href={`/members/${m.login}`}
                  title={`${m.name} 이력서 보기`}
                  className="flex flex-col items-center gap-2.5"
                >
                  <Avatar src={m.avatarUrl} name={m.name} size={40} />
                  <span className="text-base text-neutral-900">{m.name}</span>
                  {cohortLabels.length > 0 && (
                    <span className="text-sm text-neutral-500">{cohortLabels.join(', ')}</span>
                  )}
                  {roles.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {roles.map((r) => (
                        <Badge key={r} variant={ROLE_BADGE_VARIANT[r]}>
                          {r}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Link>
                <a
                  href={githubUrl(m.login)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-neutral-700 hover:text-brand"
                >
                  GitHub
                </a>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
