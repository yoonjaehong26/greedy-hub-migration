export type Track = 'FE' | 'BE';
export type MemberRoleLabel = '멤버' | '리뷰어' | '리드' | '메인테이너' | '동아리장' | 'OB';
/** 어떻게 합류했는지 — 정규 기수 스터디원이 아닌 예외 케이스만 표기(그 외엔 없음). */
export type MemberJoinType = '창립' | '영입리드';

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
  /** 창립멤버·영입리드처럼 정규 기수 '멤버'였던 적이 없는 경우만 표기. */
  joinType?: MemberJoinType;
}

export interface MemberSummaryCounts {
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
  /** 학과(복수 전공 가능). 아직 UI에 노출하지 않음 — 스키마만 선반영. */
  department?: string[];
  /** 학번(입학년도, 2자리). 아직 UI에 노출하지 않음 — 스키마만 선반영. */
  admissionYear?: number | null;
  bio: string | null;
  isPublic: boolean;
  summaryCounts: MemberSummaryCounts;
  completedMissions: MemberMissionRef[];
  blogPosts: MemberBlogPostRef[];
  teamProjects: MemberProjectRef[];
  activities: MemberActivityRef[];
}

export interface UpdateMemberPayload {
  bio?: string;
  isPublic?: boolean;
}
