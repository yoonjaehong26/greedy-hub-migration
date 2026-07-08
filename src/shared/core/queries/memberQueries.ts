import { useQuery } from '@tanstack/react-query';
import { getMember, getMembers, type GetMembersParams } from '@/shared/core/api/memberApi';

export function membersQueryKey(params: GetMembersParams = {}) {
  return ['members', params] as const;
}

export function useMembersQuery(params: GetMembersParams = {}) {
  return useQuery({
    queryKey: membersQueryKey(params),
    queryFn: () => getMembers(params),
  });
}

export function useMemberQuery(id: string) {
  return useQuery({
    queryKey: ['members', 'detail', id] as const,
    queryFn: () => getMember(id),
    enabled: id.length > 0,
  });
}
