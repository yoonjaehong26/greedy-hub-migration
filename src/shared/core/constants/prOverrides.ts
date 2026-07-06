import type { PROverride } from '@/shared/core/types/roster';

/**
 * 수동 오버라이드 시드 — QA로 걸러낸 예외를 여기에 하드하게 적는다.
 * 테스트/오작성 PR 제외, 불참(부정행위) 처리, 기수·레포 재지정 등. 파일 편집으로 관리(이후 admin UI).
 *
 * ⚠️ 왜 필요한가: GitHub `closed`에는 "왜 닫혔는지" 이유가 없다. 시스템은 닫힌 PR을
 *   재제출/실수 아니면 "닫힘(제출)"로만 분류한다. **AI 사용·부정행위로 불참 처리된 것**은
 *   자동 구분 불가 → 여기서 사람이 확정해야 "제출"로 오집계되지 않는다.
 *   후보(닫힘=제출로 표시된 케이스)는 QA로 찾아 아래에 추가한다.
 */
export const PR_OVERRIDES: PROverride[] = [
  { missionId: 'greedy-team/self-paced-react-advanced#59', status: 'exclude', note: '천동현 styled — AI 사용으로 미션 불참 처리' },
];

export const OVERRIDE_BY_ID = new Map(PR_OVERRIDES.map((o) => [o.missionId, o]));
