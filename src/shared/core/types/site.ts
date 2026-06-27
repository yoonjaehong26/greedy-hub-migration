export interface Page {
  pageId: string;
  label: string;
  url: string;
  isHome: boolean;
  frameBlocked: boolean;
  frameCheckedAt: string;
  screenshotUrl: string | null;
  ogDescription: string | null;
}

export interface Site {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  domain: string;
  thumbnailColor: string;
  pages: Page[];
  status: 'live' | 'removed';
  createdAt: string;
  updatedAt: string;
}
