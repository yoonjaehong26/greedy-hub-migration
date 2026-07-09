'use client';

import { useRoleStore, ROLES, type Role } from '@/shared/core/stores/roleStore';

export function RoleSwitcher() {
  const role = useRoleStore((s) => s.role);
  const setRole = useRoleStore((s) => s.setRole);
  const p = ROLES[role];

  return (
    <div className="fixed bottom-3 right-3 z-50 select-none">
      <div className="rounded-xl bg-slate-900/90 text-white shadow-lg ring-1 ring-white/10 px-3 py-2 text-xs">
        <div className="flex items-center gap-1.5 font-semibold mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          프로토타입 · 역할 전환
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="w-full bg-slate-800 text-white rounded-md px-2 py-1 outline-none cursor-pointer"
        >
          {(Object.entries(ROLES) as [Role, (typeof ROLES)[Role]][]).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label} · {v.name}
            </option>
          ))}
        </select>
        <div className="mt-1 text-[10px] text-slate-400">현재: {p.desc}</div>
      </div>
    </div>
  );
}
