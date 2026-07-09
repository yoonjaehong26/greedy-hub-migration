import { useQuery } from '@tanstack/react-query';
import { getActivities, getActivity } from '@/shared/core/api/activityApi';

export const ACTIVITIES_QUERY_KEY = ['activities'] as const;

export function useActivitiesQuery() {
  return useQuery({
    queryKey: ACTIVITIES_QUERY_KEY,
    queryFn: getActivities,
  });
}

export function useActivityQuery(id: string) {
  return useQuery({
    queryKey: ['activities', 'detail', id] as const,
    queryFn: () => getActivity(id),
    enabled: id.length > 0,
  });
}
