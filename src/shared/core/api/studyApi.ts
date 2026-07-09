import type { CurriculumWeek } from '@/shared/core/types/study';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api';

export async function getCurriculum(): Promise<CurriculumWeek[]> {
  const res = await fetch(`${API_BASE}/curriculum`);
  if (!res.ok) throw new Error(`GET /curriculum failed: ${res.status}`);
  const body = (await res.json()) as { items: CurriculumWeek[] };
  return body.items;
}
