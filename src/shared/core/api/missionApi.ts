import type { Mission } from '@/shared/core/types/mission';

export async function getMissions(): Promise<Mission[]> {
  const res = await fetch('/api/missions');
  if (!res.ok) throw new Error(`GET /api/missions failed: ${res.status}`);
  return res.json() as Promise<Mission[]>;
}

export async function syncMissions(): Promise<{ synced: number; repos: number }> {
  const res = await fetch('/api/missions/sync', { method: 'POST' });
  if (!res.ok) throw new Error(`POST /api/missions/sync failed: ${res.status}`);
  return res.json() as Promise<{ synced: number; repos: number }>;
}
