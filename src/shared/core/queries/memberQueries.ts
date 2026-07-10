import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMember, getMembers, updateMember } from '@/shared/core/api/memberApi';
import type { UpdateMemberPayload } from '@/shared/core/types/member';

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

export function useUpdateMemberMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMemberPayload) => updateMember(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', 'detail', id] });
    },
  });
}
