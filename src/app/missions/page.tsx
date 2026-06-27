import { Suspense } from 'react';
import { MissionSummaryCards } from '@/features/missions/MissionSummaryCards';
import { MissionMatrix } from '@/features/missions/MissionMatrix';
import { MissionList } from '@/features/missions/MissionList';
import { SyncButton } from '@/features/missions/SyncButton';

export const metadata = { title: '미션 현황 — 그리디 허브' };

export default function MissionsPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      {/* ── 헤더 ── */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">미션 현황</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
          조직 전체
        </span>
      </div>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        GitHub PR 기준 · 멤버별 14주 미션 진행 현황이 자동으로 집계됩니다.
      </p>

      {/* ── 빠른 작업 줄 (동기화 버튼) ── */}
      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        <Suspense fallback={null}>
          <SyncButton />
        </Suspense>
      </div>

      {/* ── 4-up 스탯 스트립 ── */}
      <div className="mt-7">
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-5 animate-pulse"
                >
                  <div className="h-3 w-16 rounded bg-slate-200 dark:bg-white/10" />
                  <div className="mt-3 h-8 w-12 rounded bg-slate-200 dark:bg-white/10" />
                </div>
              ))}
            </div>
          }
        >
          <MissionSummaryCards />
        </Suspense>
      </div>

      {/* ── 주력 surface: 멤버 × 미션 매트릭스 ── */}
      <Suspense fallback={<div className="mt-9 text-sm text-slate-500 py-8 text-center">매트릭스 로딩 중…</div>}>
        <MissionMatrix />
      </Suspense>

      {/* ── 보조 surface: 최근 PR 목록 ── */}
      <Suspense fallback={<div className="mt-9 text-sm text-slate-500 py-4 text-center">PR 목록 로딩 중…</div>}>
        <MissionList />
      </Suspense>
    </main>
  );
}
