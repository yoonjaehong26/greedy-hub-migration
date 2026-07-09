import { useQuery } from '@tanstack/react-query';
import { getMember, getMembers } from '@/shared/core/api/memberApi';

export const MEMBERS_QUERY_KEY = ['members'] as const;

export function useMembersQuery() {
  return useQuery({
    queryKey: MEMBERS_QUERY_KEY,
    queryFn: getMembers,
  });
}

export function useMemberQuery(id: string) {
  return useQuery({
    queryKey: ['members', 'detail', id] as const,
    queryFn: () => getMember(id),
    enabled: id.length > 0,
  });
}
