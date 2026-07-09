import type { MemberDetail, MemberSummary } from '@/shared/core/types/member';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api';

export async function getMembers(): Promise<MemberSummary[]> {
  const res = await fetch(`${API_BASE}/members`);
  if (!res.ok) throw new Error(`GET /members failed: ${res.status}`);
  const body = (await res.json()) as { items: MemberSummary[] };
  return body.items;
}

export async function getMember(id: string): Promise<MemberDetail> {
  const res = await fetch(`${API_BASE}/members/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`GET /members/${id} failed: ${res.status}`);
  return res.json() as Promise<MemberDetail>;
}
