import type { ActivityTag } from '@/shared/core/types/activity';

/** 필터 버킷(전체/행사/세션/데모데이) → 실제 tag 매핑. 축제·창립은 '행사' 버킷에 포함. */
export const CATEGORY_TO_TAGS: Record<string, ActivityTag[]> = {
  행사: ['행사', '축제', '창립'],
  세션: ['세션'],
  데모데이: ['데모데이'],
};
