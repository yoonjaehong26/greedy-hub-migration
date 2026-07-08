import type { MemberDetail, MemberSummary, Track } from '@/shared/core/types/member';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api/v1';

export interface GetMembersParams {
  track?: Track;
  cohort?: number;
}

export async function getMembers(params: GetMembersParams = {}): Promise<MemberSummary[]> {
  const query = new URLSearchParams();
  if (params.track) query.set('track', params.track);
  if (params.cohort) query.set('cohort', String(params.cohort));
  const qs = query.toString();

  const res = await fetch(`${API_BASE}/members${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(`GET /members failed: ${res.status}`);
  const body = (await res.json()) as { items: MemberSummary[] };
  return body.items;
}

export async function getMember(id: string): Promise<MemberDetail> {
  const res = await fetch(`${API_BASE}/members/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`GET /members/${id} failed: ${res.status}`);
  return res.json() as Promise<MemberDetail>;
}
