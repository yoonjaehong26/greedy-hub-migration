export type ActivityTag = '행사' | '세션' | '데모데이' | '축제' | '창립';

export interface ActivitySummary {
  id: number;
  date: string;
  tag: ActivityTag;
  /** 활동이 속한 기수(1~). 날짜/내용으로 도출 — 기수 탭 필터에 사용. */
  cohort?: number;
  title: string;
  summary: string;
  imageCount: number;
  /** sortOrder 순으로 최대 3장. imageCount가 더 많아도 목록에선 3장까지만. */
  thumbnailUrls: string[];
}

export interface ActivityImage {
  id: number;
  url: string;
  sortOrder: number;
}

export interface ActivityParticipant {
  memberId: number | null;
  name: string;
}

export interface ActivityDetail {
  id: number;
  date: string;
  tag: ActivityTag;
  /** 활동이 속한 기수(1~). 상세의 "N기" 브랜드 배지에 사용. */
  cohort?: number;
  title: string;
  body: string;
  /** 개최 장소. 없으면 날짜만 표기. 예: "세종대학교 광개토관". */
  location?: string;
  images: ActivityImage[];
  participants: ActivityParticipant[];
}
