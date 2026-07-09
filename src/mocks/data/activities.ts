/**
 * activities.ts — 활동 타임라인 목 데이터
 *
 * 출처: src/app/gallery/page.tsx의 ITEMS, src/app/gallery/[id]/page.tsx의 "4기 MT" 상세.
 * tag = 세부 라벨(행사/세션/데모데이/축제/창립). category 필터 버킷 매핑은 서버가 아니라
 * 프론트(src/features/activities/categoryFilter.ts)가 처리한다.
 */

export type ActivityTag = '행사' | '세션' | '데모데이' | '축제' | '창립';

export interface MockActivityImage {
  id: number;
  url: string;
  sortOrder: number;
}

export interface MockActivityParticipant {
  memberId: number | null;
  name: string;
}

export interface MockActivity {
  id: number;
  date: string;
  tag: ActivityTag;
  title: string;
  summary: string;
  body: string;
  images: MockActivityImage[];
  participants: MockActivityParticipant[];
}

function placeholderImages(activityId: number, count: number): MockActivityImage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: activityId * 10 + i,
    url: `https://picsum.photos/seed/greedy-activity-${activityId}-${i}/640/480`,
    sortOrder: i,
  }));
}

export const ACTIVITIES: MockActivity[] = [
  {
    id: 1,
    date: '2026.05',
    tag: '행사',
    title: '4기 MT — 1박 2일',
    summary: '4기가 처음으로 함께한 엠티. 게임하고 밤새 코드 얘기하고.',
    body: '4기가 처음으로 다 같이 모인 엠티였습니다. 낮엔 팀 게임, 밤엔 각자 관심 분야 코드 이야기로 새벽까지.\n\n처음 만난 멤버들도 금방 친해졌고, 다음 스터디·프로젝트로 이어질 팀워크의 시작이 됐어요.',
    images: placeholderImages(1, 5),
    participants: [
      { memberId: 3, name: '박지호' },
      { memberId: 4, name: '최예린' },
      { memberId: 1, name: '김민준' },
      { memberId: 2, name: '이서연' },
    ],
  },
  {
    id: 2,
    date: '2026.04',
    tag: '세션',
    title: 'React 심화 세션',
    summary: '상태관리·렌더링 최적화를 대면 스터디로 정리한 날.',
    body: '상태관리·렌더링 최적화를 대면 스터디로 정리한 날.',
    images: placeholderImages(2, 2),
    participants: [{ memberId: 3, name: '박지호' }],
  },
  {
    id: 3,
    date: '2026.03',
    tag: '행사',
    title: '4기 OT & 아이스브레이킹',
    summary: '새 기수의 시작. 트랙 소개와 커리큘럼 안내.',
    body: '새 기수의 시작. 트랙 소개와 커리큘럼 안내.',
    images: placeholderImages(3, 2),
    participants: [{ memberId: 3, name: '박지호' }],
  },
  {
    id: 4,
    date: '2025.11',
    tag: '데모데이',
    title: '3기 프로젝트 데모데이',
    summary: '한 학기 팀 프로젝트를 발표하고 피드백을 나눈 자리.',
    body: '한 학기 팀 프로젝트를 발표하고 피드백을 나눈 자리.',
    images: placeholderImages(4, 3),
    participants: [],
  },
  {
    id: 5,
    date: '2025.05',
    tag: '축제',
    title: '세종대 축제 부스 운영',
    summary: '직접 만든 웹 게임으로 부스를 운영했어요.',
    body: '직접 만든 웹 게임으로 부스를 운영했어요.',
    images: placeholderImages(5, 3),
    participants: [],
  },
  {
    id: 6,
    date: '2024.03',
    tag: '창립',
    title: '그리디 시작',
    summary: '개발에 진심인 사람들이 모여 그리디를 만들었습니다.',
    body: '개발에 진심인 사람들이 모여 그리디를 만들었습니다.',
    images: placeholderImages(6, 1),
    participants: [],
  },
];
