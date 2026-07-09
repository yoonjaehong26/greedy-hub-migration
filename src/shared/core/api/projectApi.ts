import type { ProjectDetail, ProjectSummary } from '@/shared/core/types/project';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api';

export async function getProjects(): Promise<ProjectSummary[]> {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error(`GET /projects failed: ${res.status}`);
  const body = (await res.json()) as { items: ProjectSummary[] };
  return body.items;
}

export async function getProject(id: string): Promise<ProjectDetail> {
  const res = await fetch(`${API_BASE}/projects/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`GET /projects/${id} failed: ${res.status}`);
  return res.json() as Promise<ProjectDetail>;
}
