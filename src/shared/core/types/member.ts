export type Track = 'FE' | 'BE';
export type MemberRoleLabel = '멤버' | '리뷰어' | '리드' | '메인테이너' | 'OB';

/** 한 사람이 여러 기수에 걸칠 수 있어 배열로 관리한다(예: 2기 FE 멤버 → 3기 BE 리뷰어). */
export interface Membership {
  cohort: number;
  track: Track;
  roles: MemberRoleLabel[];
  /** 데모데이 팀명(예: "두구두구"). 팀 미상이면 없음. */
  team?: string;
}

export interface MemberSummary {
  id: number;
  login: string;
  name: string;
  avatarUrl: string | null;
  memberships: Membership[];
  /** 미션 대시보드(`/missions`) 링크. 미션 데이터는 별도 시스템 소관이라 URL만 참조. */
  missionDashboardUrl?: string;
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

export interface MemberMissionRef {
  missionId: string;
  title: string;
  cohortLabel: string;
  weekLabel: string;
}

export interface MemberBlogPostRef {
  postId: number;
  title: string;
  category: string;
  relativeDate: string;
}

export interface MemberDetail extends MemberSummary {
  school: string;
  bio: string | null;
  isPublic: boolean;
  stats: MemberStats;
  completedMissions: MemberMissionRef[];
  blogPosts: MemberBlogPostRef[];
  teamProjects: MemberProjectRef[];
  activities: MemberActivityRef[];
}

export interface UpdateMemberPayload {
  bio?: string;
  isPublic?: boolean;
}
