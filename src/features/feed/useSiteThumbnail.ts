import type { Site } from '@/shared/core/types/site';

export function useSiteThumbnail(site: Site): string | null {
  const homePage = site.pages.find((p) => p.isHome) ?? site.pages[0];
  return homePage?.screenshotUrl ?? null;
}
