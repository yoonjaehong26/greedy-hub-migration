/**
 * members.ts — 멤버 목 데이터
 *
 * 출처: 미션 대시보드 로스터(`src/shared/core/constants/members.ts`) 1~4기 실명부, 39명.
 * 역할은 전부 '멤버'로 매핑(로스터가 스터디원만 추적 — 리드·리뷰어·메인테이너·OB는 범위 밖이라 데이터 없음).
 * `team`(데모데이팀)·`missionDashboardUrl`은 backend-api-spec.md에 없던 필드를 이 목업 작업에서 추가(승인됨) —
 * Spring 백엔드 설계 시 §3(멤버) 계약에 반영 필요.
 * 4기는 팀 배정이 노션에 없어 team 없음. cross-cohort 멤버(강동현·신지훈)는 memberships[] 배열로 표현.
 */

export type Track = 'FE' | 'BE';
export type MemberRoleLabel = '멤버' | '리뷰어' | '리드' | '메인테이너' | 'OB';

export interface MockMembership {
  cohort: number;
  track: Track;
  roles: MemberRoleLabel[];
  /** 데모데이 팀명(예: "두구두구"). 팀 미상이면 없음. */
  team?: string;
}

export interface MockActivityRef {
  activityId: number;
  date: string;
  tag: string;
  title: string;
}

export interface MockProjectRef {
  projectId: number;
  name: string;
  roleLabel: string;
}

export interface MockMemberStats {
  completedMissions: number;
  teamProjects: number;
  blogPosts: number;
}

export interface MockMissionRef {
  missionId: string;
  title: string;
  cohortLabel: string;
  weekLabel: string;
}

export interface MockBlogPostRef {
  postId: number;
  title: string;
  category: string;
  relativeDate: string;
}

export interface MockMember {
  id: number;
  login: string;
  name: string;
  school: string;
  avatarUrl: string | null;
  memberships: MockMembership[];
  /** 미션 대시보드(`/missions`) 링크. 미션 데이터는 별도 Mongo 시스템 소관이라 URL만 참조. */
  missionDashboardUrl?: string;
  bio?: string;
  isPublic?: boolean;
  stats?: MockMemberStats;
  completedMissions?: MockMissionRef[];
  blogPosts?: MockBlogPostRef[];
  teamProjects?: MockProjectRef[];
  activities?: MockActivityRef[];
}

export const MEMBERS: MockMember[] = [
  // ── 3기 두구두구 · 프론트 ──
  { id: 1, login: 'yoonjaehong26', name: '윤재홍', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=FE', memberships: [{ cohort: 3, track: 'FE', roles: ['멤버'], team: '두구두구' }] },
  { id: 2, login: 'Johncakes', name: '심혁', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=FE', memberships: [{ cohort: 3, track: 'FE', roles: ['멤버'], team: '두구두구' }] },
  // ── 3기 밋링크 · 프론트 ──
  { id: 3, login: 'dkr-sjr', name: '강건', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=FE', memberships: [{ cohort: 3, track: 'FE', roles: ['멤버'], team: '밋링크' }] },
  { id: 4, login: 'ehlung', name: '강예령', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=FE', memberships: [{ cohort: 3, track: 'FE', roles: ['멤버'], team: '밋링크' }] },
  // ── 3기 두구두구 · 백엔드 (강동현: cross-cohort 2기 FE(줍줍) → 3기 BE) ──
  { id: 5, login: 'mintcoke123', name: '강동현', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=BE', memberships: [{ cohort: 2, track: 'FE', roles: ['멤버'], team: '줍줍' }, { cohort: 3, track: 'BE', roles: ['멤버'], team: '두구두구' }] },
  { id: 6, login: 'tae-wooo', name: '김태우', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=BE', memberships: [{ cohort: 3, track: 'BE', roles: ['멤버'], team: '두구두구' }] },
  { id: 7, login: 'ke-62', name: '이고은', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=BE', memberships: [{ cohort: 3, track: 'BE', roles: ['멤버'], team: '두구두구' }] },
  // ── 3기 밋링크 · 백엔드 ──
  { id: 8, login: 'chemistryx', name: '하수한', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=BE', memberships: [{ cohort: 3, track: 'BE', roles: ['멤버'], team: '밋링크' }] },
  { id: 9, login: 'nonactress', name: '서현진', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=BE', memberships: [{ cohort: 3, track: 'BE', roles: ['멤버'], team: '밋링크' }] },
  { id: 10, login: 'kimsky247-coder', name: '김하늘', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=BE', memberships: [{ cohort: 3, track: 'BE', roles: ['멤버'], team: '밋링크' }] },

  // ── 2기 슬종생 · 프론트 (신지훈: cross-cohort 1기 BE(따라행) → 2기 FE, 트랙 전환) ──
  { id: 11, login: 'zldn109', name: '신지우', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=FE', memberships: [{ cohort: 2, track: 'FE', roles: ['멤버'], team: '슬종생' }] },
  { id: 12, login: 'ChangwooJ', name: '정창우', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=FE', memberships: [{ cohort: 2, track: 'FE', roles: ['멤버'], team: '슬종생' }] },
  { id: 13, login: 'developowl', name: '신지훈', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=FE', memberships: [{ cohort: 1, track: 'BE', roles: ['멤버'], team: '따라행' }, { cohort: 2, track: 'FE', roles: ['멤버'], team: '슬종생' }] },
  // ── 2기 줍줍 · 프론트 ──
  { id: 14, login: 'gxuoo', name: '임규영', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=FE', memberships: [{ cohort: 2, track: 'FE', roles: ['멤버'], team: '줍줍' }] },
  { id: 15, login: 'INSANE-P', name: '박찬빈', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=FE', memberships: [{ cohort: 2, track: 'FE', roles: ['멤버'], team: '줍줍' }] },
  // ── 2기 슬종생 · 백엔드 ──
  { id: 16, login: 'gjtjrl303', name: '허석준', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=BE', memberships: [{ cohort: 2, track: 'BE', roles: ['멤버'], team: '슬종생' }] },
  { id: 17, login: 'JihwanYeom', name: '염지환', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=BE', memberships: [{ cohort: 2, track: 'BE', roles: ['멤버'], team: '슬종생' }] },
  { id: 18, login: 'Ji-Woo-Kim', name: '김지우', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=BE', memberships: [{ cohort: 2, track: 'BE', roles: ['멤버'], team: '슬종생' }] },
  // ── 2기 줍줍 · 백엔드 ──
  { id: 19, login: 'HyerimH', name: '황혜림', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=BE', memberships: [{ cohort: 2, track: 'BE', roles: ['멤버'], team: '줍줍' }] },
  { id: 20, login: 'chxghee', name: '이창희', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=BE', memberships: [{ cohort: 2, track: 'BE', roles: ['멤버'], team: '줍줍' }] },
  { id: 21, login: 'jeonseohee9', name: '전서희', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=BE', memberships: [{ cohort: 2, track: 'BE', roles: ['멤버'], team: '줍줍' }] },

  // ── 1기 따라행 · 프론트 ──
  { id: 22, login: 'Songhyejeong', name: '송혜정', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=1&track=FE', memberships: [{ cohort: 1, track: 'FE', roles: ['멤버'], team: '따라행' }] },
  { id: 23, login: 'gogo1414', name: '김준수', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=1&track=FE', memberships: [{ cohort: 1, track: 'FE', roles: ['멤버'], team: '따라행' }] },
  // ── 1기 모꼬지 · 백엔드 ──
  { id: 24, login: 'c0mpuTurtle', name: '신혜빈', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=1&track=BE', memberships: [{ cohort: 1, track: 'BE', roles: ['멤버'], team: '모꼬지' }] },
  { id: 25, login: 'goldm0ng', name: '안금서', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=1&track=BE', memberships: [{ cohort: 1, track: 'BE', roles: ['멤버'], team: '모꼬지' }] },
  { id: 26, login: 'davidolleh', name: '황승준', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=1&track=BE', memberships: [{ cohort: 1, track: 'BE', roles: ['멤버'], team: '모꼬지' }] },
  { id: 27, login: 'sansan20535', name: '김의진', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=1&track=BE', memberships: [{ cohort: 1, track: 'BE', roles: ['멤버'], team: '모꼬지' }] },
  // ── 1기 따라행 · 백엔드 ──
  { id: 28, login: 'haeyoon1', name: '남해윤', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=1&track=BE', memberships: [{ cohort: 1, track: 'BE', roles: ['멤버'], team: '따라행' }] },
  { id: 29, login: 'SANGHEEJEONG', name: '정상희', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=1&track=BE', memberships: [{ cohort: 1, track: 'BE', roles: ['멤버'], team: '따라행' }] },

  // ── 4기 프론트 (진행 중 — 데모데이팀 노션 미기재) ──
  { id: 30, login: 'kokunut', name: '고규민', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=FE', memberships: [{ cohort: 4, track: 'FE', roles: ['멤버'] }] },
  { id: 31, login: 'realcdh', name: '천동현', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=FE', memberships: [{ cohort: 4, track: 'FE', roles: ['멤버'] }] },
  { id: 32, login: 'EM-H20', name: '홍의민', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=FE', memberships: [{ cohort: 4, track: 'FE', roles: ['멤버'] }] },
  { id: 33, login: 'rahwan10', name: '김동건', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=FE', memberships: [{ cohort: 4, track: 'FE', roles: ['멤버'] }] },
  // ── 4기 백엔드 (진행 중) ──
  { id: 34, login: 'hapdaypy', name: '김민욱', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 4, track: 'BE', roles: ['멤버'] }] },
  { id: 35, login: 'htdufhc-bit', name: '정명준', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 4, track: 'BE', roles: ['멤버'] }] },
  { id: 36, login: 'Kdahyn', name: '강대현', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 4, track: 'BE', roles: ['멤버'] }] },
  // 이태규: 4기 미션 포기(중도 하차) — 참고용, 별도 상태 필드는 아직 없음
  { id: 37, login: 'Cappucciyes', name: '이태규', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 4, track: 'BE', roles: ['멤버'] }] },
  { id: 38, login: 'chaehyunL', name: '이채현', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 4, track: 'BE', roles: ['멤버'] }] },
  { id: 39, login: 'haeun92e0', name: '김하은', school: '세종대학교', avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 4, track: 'BE', roles: ['멤버'] }] },
];
