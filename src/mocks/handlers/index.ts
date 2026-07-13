import { memberHandlers } from './members';
import { projectHandlers } from './projects';
import { studyHandlers } from './study';
import { activityHandlers } from './activities';

// stats(홈 통계)는 백엔드 없이 프론트 상수로 처리하기로 확정(2026-07-14)되어
// MSW 목 엔드포인트를 두지 않는다. (study /curriculum 정리는 스터디 페이지 작업에서)
export const handlers = [
  ...memberHandlers,
  ...projectHandlers,
  ...studyHandlers,
  ...activityHandlers,
];
