import type { Membership } from '@/shared/core/types/member';

/** 카드 등 한 줄 표시용 — 가장 최근(cohort 숫자가 큰) 소속을 대표로 고른다. */
export function primaryMembership(memberships: Membership[]): Membership | null {
  if (memberships.length === 0) return null;
  return [...memberships].sort((a, b) => b.cohort - a.cohort)[0];
}
