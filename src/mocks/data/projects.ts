/**
 * projects.ts — 팀 프로젝트 목 데이터
 *
 * 출처: 노션 "찬빈님 프로젝트 데이터정리(mcp용)" 페이지 — 1~3기 데모데이 팀 프로젝트 6개, 각 팀 하위
 * 페이지(PR 리드미 요약)에서 subtitle·description·기능 소개를 그대로 가져옴(2026-07-10).
 * 팀 로스터의 memberId는 `src/mocks/data/members.ts`(46명 SOT)와 실제로 매칭시켰다 — 외부 인원
 * (모꼬지의 방재경·신혁수·김성림)은 그리디 동아리원이 아니라 memberId: null로 이름만 표시.
 * githubUrl·liveUrl·stack(기술스택)은 `github.com/orgs/greedy-team/repositories`(33개 저장소, 2026-07-10 조사)에서
 * 실제 레포 README·배포 URL을 확인해 채웠다. FE·BE 레포가 분리돼 있어 `githubUrl`은 FE 레포를 대표로 사용(결정) —
 * 스택은 FE+BE 합쳐서 표기. 따라행은 조직 저장소 전체(2페이지)를 뒤져도 못 찾아 보류(githubUrl/liveUrl/stack 비어있음).
 * 이전 버전의 리더보드·세종라이프·그리니 목늘이기(축제 부스 3개)는 출처가 확인되지 않은 목데이터라
 * 이번 정리에서 제거했다 — 실제로는 `2025-leaderboard`·`2026-leaderboard`·`Greenie-neck-stretch` 등으로
 * greedy-team 조직에 존재하는 게 확인됐으니, 축제 부스 프로젝트도 다룰 거면 별도로 다시 정리할 것.
 *
 * 타입은 `shared/core/types/project.ts`(실제 API 계약)에서 파생 — members.ts와 같은 이유로 목업 전용
 * 타입을 따로 정의하지 않는다.
 */

import type { ProjectDetail, ProjectTeamMember } from '@/shared/core/types/project';

export type { ProjectTeamMember as MockProjectTeamMember };

export type MockProject = Pick<
  ProjectDetail,
  'id' | 'name' | 'cohortLabel' | 'trackLabel' | 'description' | 'teamSize' | 'thumbnailUrl' | 'thumbnailColor'
> &
  Partial<
    Omit<ProjectDetail, 'id' | 'name' | 'cohortLabel' | 'trackLabel' | 'description' | 'teamSize' | 'thumbnailUrl' | 'thumbnailColor'>
  >;

export const PROJECTS: MockProject[] = [
  {
    id: 1,
    name: '따라행',
    subtitle: '여행 브이로그 코스, 그대로 따라행',
    cohortLabel: '1기',
    trackLabel: 'FE/BE',
    description:
      '인기 여행 유튜브 영상을 분석해 실제 여행 동선과 장소 정보를 정리하고, 지도와 함께 일정별 여행 코스를 추천해주는 서비스.',
    teamSize: 5,
    githubUrl: null,
    liveUrl: null,
    thumbnailUrl: null,
    thumbnailColor: '#fb7185',
    team: [
      { memberId: 6, name: '송혜정', roleLabel: 'FE' },
      { memberId: 7, name: '김준수', roleLabel: 'FE' },
      { memberId: 10, name: '정상희', roleLabel: 'BE' },
      { memberId: 11, name: '남해윤', roleLabel: 'BE' },
      { memberId: 13, name: '신지훈', roleLabel: 'BE' },
    ],
    stack: [],
  },
  {
    id: 2,
    name: '모꼬지',
    subtitle: '세종대 모든 동아리를 한 곳에서',
    cohortLabel: '1기',
    trackLabel: 'FE/BE',
    description:
      '동아리 홍보와 정보 탐색의 불편함을 해결하는 세종대 동아리 통합 서비스. 동아리 검색, 실시간 모집 공고, 즐겨찾기·캘린더, 모집 알림 메일 등을 제공.',
    teamSize: 10,
    githubUrl: 'https://github.com/greedy-team/mokkoji-fe-next',
    liveUrl: 'https://www.mokkoji.site/',
    thumbnailUrl: null,
    thumbnailColor: '#15803d',
    team: [
      { memberId: null, name: '방재경', roleLabel: 'FE (외부)' },
      { memberId: null, name: '신혁수', roleLabel: 'FE (외부)' },
      { memberId: 16, name: '정창우', roleLabel: 'FE' },
      { memberId: 15, name: '신지우', roleLabel: 'FE' },
      { memberId: 14, name: '김의진', roleLabel: 'BE' },
      { memberId: 12, name: '황승준', roleLabel: 'BE' },
      { memberId: 9, name: '안금서', roleLabel: 'BE' },
      { memberId: 8, name: '신혜빈', roleLabel: 'BE' },
      { memberId: 21, name: '허석준', roleLabel: 'BE' },
      { memberId: null, name: '김성림', roleLabel: '디자인 (외부)' },
    ],
    stack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Java', 'Spring Boot', 'MySQL', 'Redis'],
  },
  {
    id: 3,
    name: '슬기로운 세종생활',
    subtitle: '세종대생이 만들고, 세종대생이 이용하는 장소 & 리뷰 서비스',
    cohortLabel: '2기',
    trackLabel: 'FE/BE',
    description:
      '세종대 근처 장소 정보와 세종대생이 직접 작성한 리뷰를 제공하는 서비스. 장소 선정과 리뷰 작성은 세종대생만 기여할 수 있다.',
    teamSize: 6,
    githubUrl: 'https://github.com/greedy-team/sejong-life-fe',
    liveUrl: 'https://sejong-life-fe.vercel.app',
    thumbnailUrl: null,
    thumbnailColor: '#fbbf24',
    team: [
      { memberId: 13, name: '신지훈', roleLabel: 'FE' },
      { memberId: 16, name: '정창우', roleLabel: 'FE' },
      { memberId: 15, name: '신지우', roleLabel: 'FE' },
      { memberId: 21, name: '허석준', roleLabel: 'BE' },
      { memberId: 24, name: '김지우', roleLabel: 'BE' },
      { memberId: 25, name: '염지환', roleLabel: 'BE' },
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Storybook', 'Java', 'Spring Boot'],
  },
  {
    id: 4,
    name: '세종 줍줍',
    subtitle: "잃어버린 물건, 이젠 헤매지 말고 간편하게 '줍줍'하세요!",
    cohortLabel: '2기',
    trackLabel: 'FE/BE',
    description:
      '세종대학교 구성원을 위한 지도 기반 분실물 찾기 웹 서비스. 캠퍼스 내 분실물을 지도 위에 표시해 잃어버린 물건과 주인을 빠르게 이어준다.',
    teamSize: 6,
    githubUrl: 'https://github.com/greedy-team/zup-zup-fe',
    liveUrl: 'https://www.sejong-zupzup.kr',
    thumbnailUrl: null,
    thumbnailColor: '#a78bfa',
    team: [
      { memberId: 18, name: '강동현', roleLabel: 'FE' },
      { memberId: 17, name: '임규영', roleLabel: 'FE' },
      { memberId: 19, name: '박찬빈', roleLabel: 'FE' },
      { memberId: 23, name: '이창희', roleLabel: 'BE' },
      { memberId: 20, name: '황혜림', roleLabel: 'BE' },
      { memberId: 22, name: '전서희', roleLabel: 'BE' },
    ],
    stack: ['React', 'TypeScript', 'Zustand', 'Axios', 'Leaflet', 'Tailwind CSS', 'Spring Boot', 'MySQL', 'Redis'],
  },
  {
    id: 5,
    name: '두구두구',
    subtitle: '세종대 두드림·학사일정을 내 캘린더에서 자동으로 받아보세요',
    cohortLabel: '3기',
    trackLabel: 'FE/BE',
    description:
      '두드림 비교과 공지와 학사일정을 자동으로 모아, 학과·키워드·학년 조건이 반영된 나만의 캘린더 구독 링크를 발급해주는 서비스.',
    teamSize: 5,
    githubUrl: 'https://github.com/greedy-team/doogoo-fe',
    liveUrl: 'https://doogoodoogoo.kr/',
    thumbnailUrl: null,
    thumbnailColor: '#34d399',
    team: [
      { memberId: 27, name: '심혁', roleLabel: 'FE' },
      { memberId: 26, name: '윤재홍', roleLabel: 'FE' },
      { memberId: 30, name: '이고은', roleLabel: 'BE' },
      { memberId: 18, name: '강동현', roleLabel: 'BE' },
      { memberId: 32, name: '김태우', roleLabel: 'BE' },
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Zustand', 'TanStack Query', 'Java', 'Spring Boot', 'PostgreSQL'],
  },
  {
    id: 6,
    name: 'MeetLink',
    subtitle: '결정 안 되던 약속, 여기서 끝내세요',
    cohortLabel: '3기',
    trackLabel: 'FE/BE',
    description:
      '여러 사람의 일정과 출발지를 모아, 모두에게 가장 알맞은 모임 시간과 공평한 모임 장소를 추천해주는 서비스.',
    teamSize: 5,
    githubUrl: 'https://github.com/greedy-team/meetlink-fe',
    liveUrl: 'https://meetlink.now',
    thumbnailUrl: null,
    thumbnailColor: '#22d3ee',
    team: [
      { memberId: 28, name: '강건', roleLabel: 'FE' },
      { memberId: 29, name: '강예령', roleLabel: 'FE' },
      { memberId: 31, name: '하수한', roleLabel: 'BE' },
      { memberId: 33, name: '서현진', roleLabel: 'BE' },
      { memberId: 34, name: '김하늘', roleLabel: 'BE' },
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'TanStack Query', 'Zustand', 'Kakao Maps API', 'Java', 'Spring Boot', 'PostgreSQL'],
  },
];
