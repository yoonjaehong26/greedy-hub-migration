/**
 * members.ts — 멤버 목 데이터
 *
 * 출처: src/app/members/page.tsx의 PEOPLE, src/app/members/[id]/page.tsx의 박지호 프로필.
 * 실제 Spring 백엔드 연동 전까지 화면에 보이는 값 그대로 옮긴 것.
 */

export type Track = 'FE' | 'BE';
export type MemberRoleLabel = '멤버' | '리뷰어' | '리드' | '메인테이너' | 'OB';

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

export interface MockMember {
  id: number;
  login: string;
  name: string;
  school: string;
  track: Track;
  cohort: number;
  roles: MemberRoleLabel[];
  avatarUrl: string | null;
  bio?: string;
  stats?: MockMemberStats;
  teamProjects?: MockProjectRef[];
  activities?: MockActivityRef[];
}

export const MEMBERS: MockMember[] = [
  { id: 1, login: 'minjun-kim', name: '김민준', school: '세종대학교', track: 'FE', cohort: 4, roles: ['멤버'], avatarUrl: null },
  { id: 2, login: 'seoyeon-lee', name: '이서연', school: '세종대학교', track: 'FE', cohort: 4, roles: ['멤버'], avatarUrl: null },
  {
    id: 3,
    login: 'jiho-park',
    name: '박지호',
    school: '세종대학교',
    track: 'FE',
    cohort: 4,
    roles: ['멤버'],
    avatarUrl: null,
    bio: '프론트엔드에 관심 많은 개발자. 그리디에서 미션·리뷰로 성장 중.',
    stats: { completedMissions: 5, teamProjects: 1, blogPosts: 3 },
    teamProjects: [{ projectId: 1, name: '모꼬지', roleLabel: 'FE 담당' }],
    activities: [
      { activityId: 1, date: '2026.05', tag: '행사', title: '4기 MT — 1박 2일' },
      { activityId: 2, date: '2026.04', tag: '세션', title: 'React 심화 세션' },
      { activityId: 3, date: '2026.03', tag: '행사', title: '4기 OT & 아이스브레이킹' },
    ],
  },
  { id: 4, login: 'yerin-choi', name: '최예린', school: '세종대학교', track: 'FE', cohort: 4, roles: ['멤버'], avatarUrl: null },
  { id: 5, login: 'woojin-jeong', name: '정우진', school: '세종대학교', track: 'FE', cohort: 4, roles: ['리뷰어'], avatarUrl: null },
  { id: 6, login: 'doyoon-han', name: '한도윤', school: '세종대학교', track: 'FE', cohort: 4, roles: ['리뷰어'], avatarUrl: null },
  { id: 7, login: 'sechan-oh', name: '오세찬', school: '세종대학교', track: 'FE', cohort: 4, roles: ['리뷰어'], avatarUrl: null },
  { id: 8, login: 'junseo-bae', name: '배준서', school: '세종대학교', track: 'FE', cohort: 4, roles: ['리뷰어'], avatarUrl: null },
  { id: 9, login: 'hajun-yoon', name: '윤하준', school: '세종대학교', track: 'FE', cohort: 4, roles: ['리뷰어', 'OB'], avatarUrl: null },
  { id: 10, login: 'minseo-kang', name: '강민서', school: '세종대학교', track: 'FE', cohort: 4, roles: ['리드', '리뷰어', '메인테이너'], avatarUrl: null },
  { id: 11, login: 'siwoo-lim', name: '임시우', school: '세종대학교', track: 'BE', cohort: 4, roles: ['멤버'], avatarUrl: null },
  { id: 12, login: 'hajun-jo', name: '조하준', school: '세종대학교', track: 'BE', cohort: 4, roles: ['멤버'], avatarUrl: null },
  { id: 13, login: 'yuna-shin', name: '신유나', school: '세종대학교', track: 'BE', cohort: 4, roles: ['멤버'], avatarUrl: null },
  { id: 14, login: 'taeyang-kwon', name: '권태양', school: '세종대학교', track: 'BE', cohort: 4, roles: ['멤버'], avatarUrl: null },
  { id: 15, login: 'seoyoon-moon', name: '문서윤', school: '세종대학교', track: 'BE', cohort: 4, roles: ['멤버'], avatarUrl: null },
  { id: 16, login: 'hyunwoo-bae', name: '배현우', school: '세종대학교', track: 'BE', cohort: 4, roles: ['멤버'], avatarUrl: null },
  { id: 17, login: 'jiwoo-hong', name: '홍지우', school: '세종대학교', track: 'BE', cohort: 4, roles: ['리뷰어'], avatarUrl: null },
  { id: 18, login: 'dohyun-kwak', name: '곽도현', school: '세종대학교', track: 'BE', cohort: 4, roles: ['리뷰어'], avatarUrl: null },
  { id: 19, login: 'sihyun-nam', name: '남시현', school: '세종대학교', track: 'BE', cohort: 4, roles: ['리뷰어'], avatarUrl: null },
  { id: 20, login: 'seungho-baek', name: '백승호', school: '세종대학교', track: 'BE', cohort: 4, roles: ['리뷰어'], avatarUrl: null },
  { id: 21, login: 'jian-seo', name: '서지안', school: '세종대학교', track: 'BE', cohort: 4, roles: ['리뷰어'], avatarUrl: null },
  { id: 22, login: 'eunchae-ko', name: '고은채', school: '세종대학교', track: 'BE', cohort: 4, roles: ['리뷰어'], avatarUrl: null },
  { id: 23, login: 'hyunsoo-ryu', name: '류현수', school: '세종대학교', track: 'BE', cohort: 4, roles: ['리뷰어'], avatarUrl: null },
  { id: 24, login: 'yejun-cha', name: '차예준', school: '세종대학교', track: 'BE', cohort: 4, roles: ['리뷰어'], avatarUrl: null },
  { id: 25, login: 'yujin-jang', name: '장유진', school: '세종대학교', track: 'BE', cohort: 4, roles: ['리뷰어'], avatarUrl: null },
];
