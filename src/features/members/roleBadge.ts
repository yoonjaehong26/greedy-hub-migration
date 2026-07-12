import type { BadgeVariant } from '@/shared/components/ui/Badge';
import type { MemberRoleLabel, Track } from '@/shared/core/types/member';

/** 역할별 Badge 색상 매핑 — 운영진(리드·메인테이너·동아리장)은 브랜드 톤, 멤버·리뷰어·OB는 뉴트럴 톤. */
export const ROLE_BADGE_VARIANT: Record<MemberRoleLabel, BadgeVariant> = {
  멤버: 'outline',
  리뷰어: 'outline',
  리드: 'brand',
  메인테이너: 'brand',
  동아리장: 'solid',
  OB: 'outline',
};

/** 운영진 필터(목록 페이지 Chip)에 해당하는 역할 묶음. */
export const STAFF_ROLES: MemberRoleLabel[] = ['리드', '메인테이너', '동아리장'];

export const TRACK_LABEL: Record<Track, string> = {
  FE: '프론트엔드',
  BE: '백엔드',
};
