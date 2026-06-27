'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'guest' | 'member' | 'reviewer' | 'staff' | 'alumni';

export const ROLES: Record<Role, { label: string; name: string; desc: string }> = {
  guest:    { label: '외부인',         name: '방문자', desc: '비동아리원 (지원 전)' },
  member:   { label: '멤버',           name: '박지호', desc: 'FE 4기 멤버' },
  reviewer: { label: '리뷰어',         name: '정우진', desc: 'FE 4기 리뷰어 (운영진 아님)' },
  staff:    { label: '운영진',         name: '강민서', desc: 'FE 리드·메인테이너' },
  alumni:   { label: '이전 기수 멤버', name: '윤하준', desc: 'FE 2기 OB (졸업)' },
};

export const NAV_ITEMS = [
  { href: '/',         label: '홈',       roles: ['guest','member','reviewer','staff','alumni'] as Role[] },
  { href: '/missions', label: '미션',     roles: ['member','staff'] as Role[] },
  { href: '/review',   label: '리뷰',     roles: ['reviewer','staff'] as Role[] },
  { href: '/study',    label: '스터디',   roles: ['member','reviewer','staff'] as Role[] },
  { href: '/blog',     label: '블로그',   roles: ['guest','member','reviewer','staff','alumni'] as Role[] },
  { href: '/projects', label: '프로젝트', roles: ['guest','member','reviewer','staff','alumni'] as Role[] },
  { href: '/gallery',  label: '활동',     roles: ['guest','member','reviewer','staff','alumni'] as Role[] },
  { href: '/members',  label: '멤버',     roles: ['guest','member','reviewer','staff','alumni'] as Role[] },
  { href: '/admin',    label: '운영진',   roles: ['staff'] as Role[] },
] as const;

interface RoleState {
  role: Role;
  setRole: (role: Role) => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      role: 'member' as Role,
      setRole: (role) => set({ role }),
    }),
    { name: 'greedy-hub-role' }
  )
);
