import { useQuery } from '@tanstack/react-query';
import { getSites } from '@/shared/core/api/siteApi';

export const SITES_QUERY_KEY = ['sites'] as const;

export function useSitesQuery() {
  return useQuery({
    queryKey: SITES_QUERY_KEY,
    queryFn: getSites,
  });
}
