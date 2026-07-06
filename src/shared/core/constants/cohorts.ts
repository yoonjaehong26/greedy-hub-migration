import type { Cohort, CohortId } from '@/shared/core/types/roster';

/**
 * 기수별 PR 귀속 날짜창.
 * cross-cohort 멤버(예: 강동현 2기 FE → 3기 BE)를 PR createdAt으로 가르는 기준.
 * 경계는 학기 전후로 약간 넉넉하게 잡음.
 */
export const COHORTS: Record<CohortId, Cohort> = {
  1: { id: 1, label: '1기', semester: '2024-2', startDate: '2024-08-15', endDate: '2025-02-28', ongoing: false },
  2: { id: 2, label: '2기', semester: '2025-1', startDate: '2025-02-15', endDate: '2025-08-31', ongoing: false },
  3: { id: 3, label: '3기', semester: '2025-2', startDate: '2025-08-15', endDate: '2026-03-15', ongoing: false },
  4: { id: 4, label: '4기', semester: '2026-1', startDate: '2026-02-15', endDate: '2026-08-31', ongoing: true },
};

/** 파일럿 기본 기수. */
export const PILOT_COHORT: CohortId = 3;
