import type { PROverride } from '@/shared/core/types/roster';

/**
 * 수동 오버라이드 시드 — QA로 걸러낸 예외를 여기에 하드하게 적는다.
 * 테스트/오작성 PR 제외, 기수·레포 재지정 등. 파일럿은 파일 편집으로 관리(이후 admin UI).
 * 예:
 *   { missionId: 'greedy-team/react-todo-list#12', status: 'exclude', note: '메인테이너 테스트 PR' }
 */
export const PR_OVERRIDES: PROverride[] = [];

export const OVERRIDE_BY_ID = new Map(PR_OVERRIDES.map((o) => [o.missionId, o]));
