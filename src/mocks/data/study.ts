/**
 * study.ts — 스터디 커리큘럼 목 데이터
 *
 * 출처: src/app/study/page.tsx의 WEEKS.
 * 원본 화면은 트랙(FE/BE) 토글이 있으나 실제 콘텐츠 분기가 없어 두 트랙에 동일 커리큘럼을 둔다.
 */

export type Track = 'FE' | 'BE';
export type WeekStatus = 'DONE' | 'ACTIVE' | 'BREAK';

export interface MockCurriculumWeek {
  id: number;
  track: Track;
  weekNo: number;
  weekLabel: string;
  title: string;
  status: WeekStatus;
  noteUrl: string | null;
  notionUrl: string | null;
  linkedMissionId: number | null;
}

function buildWeeks(track: Track, idOffset: number): MockCurriculumWeek[] {
  return [
    {
      id: idOffset + 1,
      track,
      weekNo: 1,
      weekLabel: '1주차',
      title: 'JSX & 컴포넌트 기초',
      status: 'DONE',
      noteUrl: null,
      notionUrl: null,
      linkedMissionId: 1,
    },
    {
      id: idOffset + 2,
      track,
      weekNo: 5,
      weekLabel: '5주차',
      title: '라우팅 & SPA',
      status: 'ACTIVE',
      noteUrl: null,
      notionUrl: null,
      linkedMissionId: 1,
    },
    {
      id: idOffset + 3,
      track,
      weekNo: 7,
      weekLabel: '7주차',
      title: '중간고사 주간',
      status: 'BREAK',
      noteUrl: null,
      notionUrl: null,
      linkedMissionId: null,
    },
  ];
}

export const CURRICULUM_WEEKS: MockCurriculumWeek[] = [...buildWeeks('FE', 0), ...buildWeeks('BE', 100)];
