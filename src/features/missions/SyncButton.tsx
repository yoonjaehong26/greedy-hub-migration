'use client';

import { useSyncMissionsMutation } from '@/shared/core/queries/missionQueries';

/** "빠른 작업" 줄에 인라인으로 삽입되는 동기화 버튼. admin.html 보조 버튼 스타일로 통일. */
export function SyncButton() {
  const { mutate, isPending, isSuccess, data } = useSyncMissionsMutation();

  return (
    <>
      <button
        onClick={() => mutate()}
        disabled={isPending}
        title="GitHub API에서 미션 PR을 최신화합니다"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold ring-1 ring-slate-900/10 dark:ring-white/10 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg
          className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        {isPending ? '동기화 중…' : 'GitHub 동기화'}
      </button>
      {isSuccess && (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {data.synced}건 업데이트 · {data.repos}개 레포
        </span>
      )}
    </>
  );
}
