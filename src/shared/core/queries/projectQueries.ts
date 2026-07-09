import { useQuery } from '@tanstack/react-query';
import { getProject, getProjects } from '@/shared/core/api/projectApi';

export const PROJECTS_QUERY_KEY = ['projects'] as const;

export function useProjectsQuery() {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: getProjects,
  });
}

export function useProjectQuery(id: string) {
  return useQuery({
    queryKey: ['projects', 'detail', id] as const,
    queryFn: () => getProject(id),
    enabled: id.length > 0,
  });
}
