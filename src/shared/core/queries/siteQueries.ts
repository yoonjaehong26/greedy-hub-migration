import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSites, createSite } from '@/shared/core/api/siteApi';

export const SITES_QUERY_KEY = ['sites'] as const;

export function useSitesQuery() {
  return useQuery({
    queryKey: SITES_QUERY_KEY,
    queryFn: getSites,
  });
}

export function useCreateSiteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ url, frameBlocked }: { url: string; frameBlocked: boolean }) =>
      createSite(url, frameBlocked),
    onSuccess: () => qc.invalidateQueries({ queryKey: SITES_QUERY_KEY }),
  });
}
