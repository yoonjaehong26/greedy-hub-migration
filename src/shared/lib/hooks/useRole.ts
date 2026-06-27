'use client';

import { useRoleStore } from '@/shared/core/stores/roleStore';

export function useRole() {
  return useRoleStore((s) => s.role);
}
