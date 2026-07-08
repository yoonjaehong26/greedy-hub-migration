import type { ProjectDetail, ProjectSummary } from '@/shared/core/types/project';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api/v1';

export async function getProjects(filter?: string): Promise<ProjectSummary[]> {
  const qs = filter && filter !== '전체' ? `?filter=${encodeURIComponent(filter)}` : '';
  const res = await fetch(`${API_BASE}/projects${qs}`);
  if (!res.ok) throw new Error(`GET /projects failed: ${res.status}`);
  const body = (await res.json()) as { items: ProjectSummary[] };
  return body.items;
}

export async function getProject(id: string): Promise<ProjectDetail> {
  const res = await fetch(`${API_BASE}/projects/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`GET /projects/${id} failed: ${res.status}`);
  return res.json() as Promise<ProjectDetail>;
}
