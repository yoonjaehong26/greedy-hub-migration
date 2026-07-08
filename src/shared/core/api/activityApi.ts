import type { ActivityDetail, ActivitySummary } from '@/shared/core/types/activity';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api/v1';

export async function getActivities(category?: string): Promise<ActivitySummary[]> {
  const qs = category && category !== '전체' ? `?category=${encodeURIComponent(category)}` : '';
  const res = await fetch(`${API_BASE}/activities${qs}`);
  if (!res.ok) throw new Error(`GET /activities failed: ${res.status}`);
  const body = (await res.json()) as { items: ActivitySummary[] };
  return body.items;
}

export async function getActivity(id: string): Promise<ActivityDetail> {
  const res = await fetch(`${API_BASE}/activities/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`GET /activities/${id} failed: ${res.status}`);
  return res.json() as Promise<ActivityDetail>;
}
