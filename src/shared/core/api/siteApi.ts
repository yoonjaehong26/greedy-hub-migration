import type { Site } from '@/shared/core/types/site';

export async function getSites(): Promise<Site[]> {
  const res = await fetch('/api/sites');
  if (!res.ok) throw new Error(`GET /api/sites failed: ${res.status}`);
  return res.json() as Promise<Site[]>;
}

export async function createSite(url: string, frameBlocked: boolean): Promise<Site> {
  const res = await fetch('/api/sites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, frameBlocked }),
  });
  if (!res.ok) throw new Error(`POST /api/sites failed: ${res.status}`);
  return res.json() as Promise<Site>;
}
