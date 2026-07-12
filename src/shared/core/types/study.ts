export type Track = 'FE' | 'BE';

/**
 * 개별 주차 상태.
 * DONE: 종료된 주차 · ACTIVE: 진행 중인 주차 · UPCOMING: 아직 시작 전 · BREAK: 쉬는 주(중간고사 등)
 */
export type WeekStatus = 'DONE' | 'ACTIVE' | 'UPCOMING' | 'BREAK';

export interface CurriculumWeek {
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

/** 트랙 소개 — 트랙 탭 하단에 한 번만 노출되는 트랙 전체 설명 */
export interface CurriculumTrackIntro {
  track: Track;
  title: string;
  description: string;
  techTags: string[];
}

/**
 * 커리큘럼 단계 — 여러 주차를 하나의 학습 단계로 묶은 그룹.
 * Figma "주차별 커리큘럼" 타임라인의 카드 한 장에 대응한다.
 */
export interface CurriculumStage {
  id: number;
  track: Track;
  order: number;
  title: string;
  weekRangeLabel: string;
  description: string;
  missionName: string;
  techTags: string[];
  externalLinks: { label: string; url: string }[];
  weeks: CurriculumWeek[];
}
