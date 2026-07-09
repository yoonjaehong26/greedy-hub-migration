export type ActivityTag = '행사' | '세션' | '데모데이' | '축제' | '창립';

export interface ActivitySummary {
  id: number;
  date: string;
  tag: ActivityTag;
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
  title: string;
  body: string;
  images: ActivityImage[];
  participants: ActivityParticipant[];
}
