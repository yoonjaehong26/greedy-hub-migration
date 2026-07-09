import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/shared/core/api/statsApi';

export function useStatsQuery() {
  return useQuery({
    queryKey: ['stats'] as const,
    queryFn: getStats,
  });
}
