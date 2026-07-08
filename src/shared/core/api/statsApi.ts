import type { HubStats } from '@/shared/core/types/stats';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api/v1';

export async function getStats(): Promise<HubStats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error(`GET /stats failed: ${res.status}`);
  return res.json() as Promise<HubStats>;
}
