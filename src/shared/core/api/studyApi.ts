import type { CurriculumResponse, Track } from '@/shared/core/types/study';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api/v1';

export async function getCurriculum(track: Track): Promise<CurriculumResponse> {
  const res = await fetch(`${API_BASE}/study/curriculum?track=${track}`);
  if (!res.ok) throw new Error(`GET /study/curriculum failed: ${res.status}`);
  return res.json() as Promise<CurriculumResponse>;
}
