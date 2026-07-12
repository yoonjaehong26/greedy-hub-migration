import type { CurriculumStage, CurriculumTrackIntro } from '@/shared/core/types/study';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api';

export interface CurriculumResponse {
  stages: CurriculumStage[];
  trackIntros: CurriculumTrackIntro[];
}

export async function getCurriculum(): Promise<CurriculumResponse> {
  const res = await fetch(`${API_BASE}/curriculum`);
  if (!res.ok) throw new Error(`GET /curriculum failed: ${res.status}`);
  const body = (await res.json()) as { items: CurriculumStage[]; trackIntros: CurriculumTrackIntro[] };
  return { stages: body.items, trackIntros: body.trackIntros };
}
