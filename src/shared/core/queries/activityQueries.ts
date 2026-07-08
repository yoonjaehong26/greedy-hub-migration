import { useQuery } from '@tanstack/react-query';
import { getActivities, getActivity } from '@/shared/core/api/activityApi';

export function activitiesQueryKey(category?: string) {
  return ['activities', category ?? '전체'] as const;
}

export function useActivitiesQuery(category?: string) {
  return useQuery({
    queryKey: activitiesQueryKey(category),
    queryFn: () => getActivities(category),
  });
}

export function useActivityQuery(id: string) {
  return useQuery({
    queryKey: ['activities', 'detail', id] as const,
    queryFn: () => getActivity(id),
    enabled: id.length > 0,
  });
}
