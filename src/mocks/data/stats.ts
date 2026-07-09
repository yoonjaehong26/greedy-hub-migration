/**
 * stats.ts — 홈 통계 목 데이터
 *
 * 출처: src/app/page.tsx의 STATS. 값 산출 방식(집계 vs 별도 관리)은 백엔드 구현 재량 —
 * 프론트는 이 숫자를 그대로 받아 표시할 뿐이다.
 */

export interface MockStats {
  totalMembers: number;
  activeCohort: number;
  tracks: string;
  teamProjects: number;
}

export const STATS: MockStats = {
  totalMembers: 50,
  activeCohort: 4,
  tracks: 'FE · BE',
  teamProjects: 12,
};
