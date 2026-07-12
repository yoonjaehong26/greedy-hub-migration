/**
 * study.ts — 스터디 커리큘럼 목 데이터
 *
 * 출처: Figma "스터디" 프레임(node 69:1194 FE / 69:1642 BE / 69:1331 모바일).
 * 트랙 소개(techTags 포함)는 트랙당 한 번만 노출되고, 커리큘럼은 여러 주차를
 * 하나의 단계(CurriculumStage)로 묶어 타임라인 카드로 보여준다.
 */

import type { CurriculumStage, CurriculumTrackIntro, CurriculumWeek, Track, WeekStatus } from '@/shared/core/types/study';

export const CURRICULUM_TRACK_INTROS: CurriculumTrackIntro[] = [
  {
    track: 'FE',
    title: '프론트엔드 트랙',
    description:
      '사용자가 보고 만지는 화면을 만들어요. 자바스크립트 3주와 리액트 11주,\n총 14주 미션을 지나면 서버에서 렌더링하는 방법까지 다루게 돼요.\n초록스터디 자료와 그리디가 직접 만든 자료로 진행해요.',
    techTags: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', '협업과 Git'],
  },
  {
    track: 'BE',
    title: '백엔드 트랙',
    description:
      '화면 뒤에서 데이터를 다루는 서버를 만들어요. 자바 5주와 스프링 9주,\n총 14주 미션을 지나면 인증부터 배포까지 직접 해보게 돼요.\n초록스터디 자료와 그리디가 직접 만든 자료로 진행해요.',
    techTags: ['Java', '객체지향', 'Spring Boot', 'JPA와 DB', '협업과 Git'],
  },
];

/** 주차 범위(예: "1~3") 문자열을 받아 개별 CurriculumWeek 배열을 만든다. */
function buildWeeks(
  track: Track,
  idOffset: number,
  weekNos: number[],
  currentWeekNo: number,
  linkedMissionId: number | null,
): CurriculumWeek[] {
  return weekNos.map((weekNo, i) => {
    const status: WeekStatus = weekNo < currentWeekNo ? 'DONE' : weekNo === currentWeekNo ? 'ACTIVE' : 'UPCOMING';
    return {
      id: idOffset + i + 1,
      track,
      weekNo,
      weekLabel: `${weekNo}주차`,
      title: '',
      status,
      noteUrl: null,
      notionUrl: null,
      linkedMissionId: status === 'UPCOMING' ? null : linkedMissionId,
    };
  });
}

const FE_CURRENT_WEEK = 5;
const BE_CURRENT_WEEK = 6;

export const CURRICULUM_STAGES: CurriculumStage[] = [
  // 프론트엔드
  {
    id: 1,
    track: 'FE',
    order: 1,
    title: '자바스크립트 기초',
    weekRangeLabel: '1~3주차',
    description: '프레임워크 없이 자바스크립트만으로 게임을 만들며 기본기를 다져요.',
    missionName: '숫자 야구, 탐욕의 룰렛, 좀비 게임',
    techTags: [],
    externalLinks: [],
    weeks: buildWeeks('FE', 0, [1, 2, 3], FE_CURRENT_WEEK, 1),
  },
  {
    id: 2,
    track: 'FE',
    order: 2,
    title: '리액트 기초',
    weekRangeLabel: '4~5주차',
    description: '컴포넌트와 상태, 데이터 흐름을 익히고 API 연결까지 해봐요.',
    missionName: 'self-paced-react Step 1~5',
    techTags: [],
    externalLinks: [],
    weeks: buildWeeks('FE', 10, [4, 5], FE_CURRENT_WEEK, 2),
  },
  {
    id: 3,
    track: 'FE',
    order: 3,
    title: '리액트 심화',
    weekRangeLabel: '6~9주차',
    description: 'Context, Zustand, Tanstack Query로 상태 관리의 폭을 넓혀요.',
    missionName: 'self-paced-react-advanced',
    techTags: [],
    externalLinks: [],
    weeks: buildWeeks('FE', 20, [6, 7, 8, 9], FE_CURRENT_WEEK, 3),
  },
  {
    id: 4,
    track: 'FE',
    order: 4,
    title: '자유 미션',
    weekRangeLabel: '10~12주차',
    description: '라우팅, 접근성, 테스트를 챙기며 원하는 것을 만들어요.',
    missionName: '무엇이든 만들어보세요',
    techTags: [],
    externalLinks: [],
    weeks: buildWeeks('FE', 30, [10, 11, 12], FE_CURRENT_WEEK, null),
  },
  {
    id: 5,
    track: 'FE',
    order: 5,
    title: 'SSR 전환',
    weekRangeLabel: '13~14주차',
    description: '만든 앱을 서버에서 렌더링하도록 옮기며 동작 원리를 이해해요.',
    missionName: '리액트 포켓몬 도감',
    techTags: [],
    externalLinks: [],
    weeks: buildWeeks('FE', 40, [13, 14], FE_CURRENT_WEEK, null),
  },
  // 백엔드
  {
    id: 6,
    track: 'BE',
    order: 1,
    title: '자바 기초',
    weekRangeLabel: '1~5주차',
    description: '객체지향 설계를 미션으로 연습하며 자바 기본기를 다져요.',
    missionName: '자동차 경주, 로또, 사다리',
    techTags: [],
    externalLinks: [],
    weeks: buildWeeks('BE', 100, [1, 2, 3, 4, 5], BE_CURRENT_WEEK, 6),
  },
  {
    id: 7,
    track: 'BE',
    order: 2,
    title: '스프링 입문',
    weekRangeLabel: '6~8주차',
    description: '웹 요청이 처리되는 흐름을 만들고 데이터베이스를 연결해요.',
    missionName: 'Spring MVC, JDBC',
    techTags: [],
    externalLinks: [],
    weeks: buildWeeks('BE', 110, [6, 7, 8], BE_CURRENT_WEEK, 7),
  },
  {
    id: 8,
    track: 'BE',
    order: 3,
    title: '코어와 인증',
    weekRangeLabel: '9~11주차',
    description: '스프링이 객체를 관리하는 방식을 이해하고 로그인 인증을 구현해요.',
    missionName: 'Spring Core, MVC 인증',
    techTags: [],
    externalLinks: [],
    weeks: buildWeeks('BE', 120, [9, 10, 11], BE_CURRENT_WEEK, null),
  },
  {
    id: 9,
    track: 'BE',
    order: 4,
    title: 'JPA',
    weekRangeLabel: '12~13주차',
    description: 'ORM으로 데이터를 다루는 방법을 익혀요.',
    missionName: 'Spring JPA',
    techTags: [],
    externalLinks: [],
    weeks: buildWeeks('BE', 130, [12, 13], BE_CURRENT_WEEK, null),
  },
  {
    id: 10,
    track: 'BE',
    order: 5,
    title: '배포',
    weekRangeLabel: '14주차',
    description: '만든 서버를 실제 환경에 올리며 한 학기를 마무리해요.',
    missionName: '서비스 배포',
    techTags: [],
    externalLinks: [],
    weeks: buildWeeks('BE', 140, [14], BE_CURRENT_WEEK, null),
  },
];
