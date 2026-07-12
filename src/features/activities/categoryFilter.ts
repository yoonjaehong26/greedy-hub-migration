import type { ActivityTag } from '@/shared/core/types/activity';

/**
 * 필터 버킷 → 실제 tag 매핑. 축제·창립은 '행사' 버킷에 포함.
 * Figma 와이어프레임 카테고리(엠티/밋업/스터디)는 실데이터 태그와 맞지 않아,
 * 빈 필터를 만드는 대신 실데이터가 실제로 가진 태그(행사/세션/데모데이/축제/창립)를
 * 커버하는 버킷으로 정의한다.
 */
export const CATEGORY_TO_TAGS: Record<string, ActivityTag[]> = {
  행사: ['행사', '축제', '창립'],
  세션: ['세션'],
  데모데이: ['데모데이'],
};

/** 필터 칩에 표시할 라벨 순서(전체 + 각 버킷). */
export const CATEGORY_LABELS = ['전체', ...Object.keys(CATEGORY_TO_TAGS)] as const;
