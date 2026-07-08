/**
 * projects.ts — 팀 프로젝트 목 데이터
 *
 * 출처: src/app/projects/page.tsx의 PROJECTS, src/app/projects/[id]/page.tsx의 모꼬지 상세.
 */

export interface MockProjectTeamMember {
  memberId: number | null;
  name: string;
  roleLabel: string;
}

export interface MockProject {
  id: number;
  name: string;
  subtitle?: string;
  cohortLabel: string;
  trackLabel: string;
  description: string;
  teamSize: number;
  githubUrl: string | null;
  liveUrl: string | null;
  thumbnailUrl: string | null;
  thumbnailColor: string;
  team?: MockProjectTeamMember[];
  stack?: string[];
}

export const PROJECTS: MockProject[] = [
  {
    id: 1,
    name: '모꼬지',
    subtitle: '동아리 통합 플랫폼',
    cohortLabel: '4기',
    trackLabel: '공통',
    description: '세종대학교의 여러 동아리를 한곳에서 잇는 통합 플랫폼. 데모데이에서 발표된 4기 팀 프로젝트.',
    teamSize: 5,
    githubUrl: null,
    liveUrl: null,
    thumbnailUrl: null,
    thumbnailColor: '#15803d',
    team: [
      { memberId: 3, name: '박지호', roleLabel: 'FE' },
      { memberId: 4, name: '최예린', roleLabel: 'FE' },
      { memberId: 2, name: '이서연', roleLabel: 'BE' },
    ],
    stack: ['Next.js', 'Spring Boot', 'PostgreSQL'],
  },
  {
    id: 2,
    name: '두구두구',
    cohortLabel: '3기',
    trackLabel: 'FE/BE',
    description: '행사용 실시간 추첨 도구',
    teamSize: 4,
    githubUrl: null,
    liveUrl: null,
    thumbnailUrl: null,
    thumbnailColor: '#34d399',
  },
  {
    id: 3,
    name: '리더보드',
    cohortLabel: '축제',
    trackLabel: '부스',
    description: '세종대 축제 부스 게임 웹',
    teamSize: 3,
    githubUrl: null,
    liveUrl: null,
    thumbnailUrl: null,
    thumbnailColor: '#fbbf24',
  },
  {
    id: 4,
    name: '세종라이프',
    cohortLabel: '3기',
    trackLabel: '공통',
    description: '세종대 생활 정보 서비스',
    teamSize: 5,
    githubUrl: null,
    liveUrl: null,
    thumbnailUrl: null,
    thumbnailColor: '#fb7185',
  },
  {
    id: 5,
    name: '그리니 목늘이기',
    cohortLabel: '축제',
    trackLabel: '게임',
    description: '웹 미니게임 (축제 부스)',
    teamSize: 2,
    githubUrl: null,
    liveUrl: null,
    thumbnailUrl: null,
    thumbnailColor: '#a78bfa',
  },
  {
    id: 6,
    name: '밋링크',
    cohortLabel: '2기',
    trackLabel: 'FE/BE',
    description: '모임 일정 조율 서비스',
    teamSize: 4,
    githubUrl: null,
    liveUrl: null,
    thumbnailUrl: null,
    thumbnailColor: '#22d3ee',
  },
];
