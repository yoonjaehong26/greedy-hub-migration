import { Suspense } from 'react';
import { MemberMissionList } from '@/features/missions/MemberMissionList';
import { SyncButton } from '@/features/missions/SyncButton';

export const metadata = { title: '미션 현황 — 그리디 허브' };

export default function MissionsPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      {/* ── 헤더 ── */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">미션 현황</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
          기수·트랙별
        </span>
      </div>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        멤버별 미션 진행 현황 · GitHub PR을 명부에 맞춰 단계 단위로 자동 집계합니다. 기수·트랙을 선택하세요.
      </p>

      {/* ── 동기화 ── */}
      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        <Suspense fallback={null}>
          <SyncButton />
        </Suspense>
      </div>

      {/* ── 멤버 중심 리스트 (주력 surface) ── */}
      <Suspense fallback={<div className="mt-9 text-sm text-slate-500 py-8 text-center">불러오는 중…</div>}>
        <MemberMissionList />
      </Suspense>
    </main>
  );
}
