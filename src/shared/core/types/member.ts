export type Track = 'FE' | 'BE';
export type MemberRoleLabel = '멤버' | '리뷰어' | '리드' | '메인테이너' | 'OB';

export interface MemberSummary {
  id: number;
  login: string;
  name: string;
  track: Track;
  cohort: number;
  roles: MemberRoleLabel[];
  avatarUrl: string | null;
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
