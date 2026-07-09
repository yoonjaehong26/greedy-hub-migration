export type Track = 'FE' | 'BE';
export type MemberRoleLabel = '멤버' | '리뷰어' | '리드' | '메인테이너' | 'OB';

/** 한 사람이 여러 기수에 걸칠 수 있어 배열로 관리한다(예: 2기 FE 멤버 → 3기 BE 리뷰어). */
export interface Membership {
  cohort: number;
  track: Track;
  roles: MemberRoleLabel[];
}

export interface MemberSummary {
  id: number;
  login: string;
  name: string;
  avatarUrl: string | null;
  memberships: Membership[];
}

export interface MemberStats {
  completedMissions: number;
  teamProjects: number;
  blogPosts: number;
}

export interface MemberProjectRef {
  projectId: number;
  name: string;
  roleLabel: string;
}

export interface MemberActivityRef {
  activityId: number;
  date: string;
  tag: string;
  title: string;
}

export interface MemberDetail extends MemberSummary {
  school: string;
  bio: string | null;
  stats: MemberStats;
  teamProjects: MemberProjectRef[];
  activities: MemberActivityRef[];
}
