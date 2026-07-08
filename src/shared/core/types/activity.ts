export type ActivityTag = '행사' | '세션' | '데모데이' | '축제' | '창립';

export interface ActivitySummary {
  id: number;
  date: string;
  tag: ActivityTag;
  title: string;
  summary: string;
  imageCount: number;
  thumbnailUrl: string | null;
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
  coverImageUrl: string | null;
  images: ActivityImage[];
  participants: ActivityParticipant[];
}
