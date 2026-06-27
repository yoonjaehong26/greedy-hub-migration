import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMissions, syncMissions } from '@/shared/core/api/missionApi';

export const MISSIONS_QUERY_KEY = ['missions'] as const;

export function useMissionsQuery() {
  return useQuery({
    queryKey: MISSIONS_QUERY_KEY,
    queryFn: getMissions,
  });
}

export function useSyncMissionsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncMissions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MISSIONS_QUERY_KEY });
    },
  });
}
