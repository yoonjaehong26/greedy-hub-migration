/**
 * 홈 통계 밴드.
 *
 * stats(누적 멤버/진행 기수/트랙/팀 프로젝트)는 백엔드 없이 프론트에서 관리하기로
 * 확정(2026-07-14)되어, API/Query/MSW 없이 이 상수를 그대로 표시한다.
 * 값 갱신은 이 배열만 수정하면 된다.
 */
const STATS: { label: string; value: string }[] = [
  { label: '누적 멤버', value: '50' },
  { label: '진행 기수', value: '4기' },
  { label: '트랙', value: 'FE · BE' },
  { label: '팀 프로젝트', value: '12' },
];

export function HomeStats() {
  return (
    <dl className="flex flex-wrap items-center justify-center gap-x-[120px] gap-y-6 bg-neutral-50 py-14 dark:bg-slate-800/40">
      {STATS.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-1">
          <dd className="text-[32px] font-bold text-brand">{s.value}</dd>
          <dt className="text-sm text-neutral-500 dark:text-slate-400">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}
