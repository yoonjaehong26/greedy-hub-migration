import { useQuery } from '@tanstack/react-query';
import { getProject, getProjects } from '@/shared/core/api/projectApi';

export function projectsQueryKey(filter?: string) {
  return ['projects', filter ?? '전체'] as const;
}

export function useProjectsQuery(filter?: string) {
  return useQuery({
    queryKey: projectsQueryKey(filter),
    queryFn: () => getProjects(filter),
  });
}

export function useProjectQuery(id: string) {
  return useQuery({
    queryKey: ['projects', 'detail', id] as const,
    queryFn: () => getProject(id),
    enabled: id.length > 0,
  });
}
