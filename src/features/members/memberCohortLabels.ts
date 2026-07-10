import type { Membership, MemberOrigin } from '@/shared/core/types/member';

/**
 * 카드 표시용 — '멤버'였던 기수만 오름차순으로 라벨화한다(예: "FE · 2기, BE · 3기").
 * 메인테이너·리드·리뷰어·동아리장은 승격 이후 역할이라 여기엔 반영하지 않는다.
 * 창립·영입리드처럼 '멤버' 이력이 아예 없는 경우는 origin으로 대체 표기.
 */
export function memberCohortLabels(memberships: Membership[], origin?: MemberOrigin): string[] {
  const memberCohorts = [...memberships]
    .filter((ms) => ms.roles.includes('멤버'))
    .sort((a, b) => a.cohort - b.cohort)
    .map((ms) => `${ms.track} · ${ms.cohort}기`);

  if (memberCohorts.length > 0) return memberCohorts;
  return origin ? [origin] : [];
}
