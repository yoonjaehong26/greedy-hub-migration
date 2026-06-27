import type { Site } from '@/shared/core/types/site';

export async function getSites(): Promise<Site[]> {
  const res = await fetch('/api/sites');
  if (!res.ok) throw new Error(`GET /api/sites failed: ${res.status}`);
  return res.json() as Promise<Site[]>;
}
