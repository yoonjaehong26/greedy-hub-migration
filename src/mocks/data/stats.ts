/**
 * stats.ts — 홈 통계 목 데이터
 *
 * 출처: src/app/page.tsx의 STATS. member/project 집계와 별개로 마케팅 문구성 전체 통계라
 * 실제 백엔드에서도 누적치(현재 명부 수와 무관)로 별도 관리될 값.
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
