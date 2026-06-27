'use client';

import { useMissionsQuery } from '@/shared/core/queries/missionQueries';
import { MISSION_COLUMNS, resolveWeekIndex } from '@/shared/core/constants/missionColumns';
import type { Mission } from '@/shared/core/types/mission';
import Link from 'next/link';

type CellState = 'done' | 'review' | 'none';

const CELL_CLS: Record<CellState, string> = {
  done:   'bg-emerald-500',
  review: 'bg-brand',
  none:   'bg-slate-300 dark:bg-white/20',
};

const CELL_LABEL: Record<CellState, string> = {
  done:   '완료',
  review: '리뷰 중',
  none:   '미제출',
};

interface MatrixRow {
  author: string;
  cells: CellState[];
  mergedCount: number;
}

function buildMatrix(missions: Mission[]): {
  rows: MatrixRow[];
  fallbackCount: number;
} {
  // (author, weekIndex) → 최선 상태 (merged > open > none)
  const stateMap = new Map<string, CellState>();
  let fallbackCount = 0;

  for (const m of missions) {
    const result = resolveWeekIndex(m.repository, m.title);
    if (result === null) continue; // 커리큘럼 외 레포 무시

    if (result.isFallback) fallbackCount++;

    const key = `${m.author}__${result.weekIndex}`;
    const cur = stateMap.get(key) ?? 'none';

    let next: CellState;
    if (m.state === 'merged') next = 'done';
    else if (m.state === 'open') next = 'review';
    else next = 'none';

    // merged > open > none 우선순위
    if (cur === 'done') continue;
    if (cur === 'review' && next !== 'done') continue;
    stateMap.set(key, next);
  }

  // 멤버 목록 추출 (merged 수 내림차순 → 이름 오름차순)
  const authors = Array.from(new Set(missions.map((m) => m.author))).sort();

  const rows: MatrixRow[] = authors.map((author) => {
    const cells: CellState[] = MISSION_COLUMNS.map((col) => {
      return stateMap.get(`${author}__${col.weekIndex}`) ?? 'none';
    });
    const mergedCount = cells.filter((c) => c === 'done').length;
    return { author, cells, mergedCount };
  });

  // 머지 수 내림차순 정렬
  rows.sort((a, b) => b.mergedCount - a.mergedCount || a.author.localeCompare(b.author));

  return { rows, fallbackCount };
}

function completionRate(cells: CellState[]): string {
  const done = cells.filter((c) => c === 'done').length;
  return Math.round((done / cells.length) * 100) + '%';
}

export function MissionMatrix() {
  const { data: missions = [], isLoading } = useMissionsQuery();

  if (isLoading) {
    return (
      <div className="mt-3 rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-8 text-center text-sm text-slate-500">
        불러오는 중…
      </div>
    );
  }

  if (missions.length === 0) {
    return (
      <div className="mt-3 rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-8 text-center text-sm text-slate-400">
        데이터가 없습니다. GitHub 동기화를 실행해주세요.
      </div>
    );
  }

  const { rows, fallbackCount } = buildMatrix(missions);

  return (
    <>
      {/* 매트릭스 헤더 */}
      <div className="mt-9 flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg font-semibold">멤버 × 미션 매트릭스</h2>
        <div className="hidden sm:flex gap-3 text-xs text-slate-500">
          {(
            [
              { cls: 'bg-emerald-500', label: '완료' },
              { cls: 'bg-brand',       label: '리뷰중' },
              { cls: 'bg-slate-300 dark:bg-white/20', label: '미제출' },
            ] as const
          ).map((l) => (
            <span key={l.label} className="inline-flex items-center gap-1">
              <i className={`w-3 h-3 rounded-sm ${l.cls} inline-block`} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* 테이블 */}
      <div className="mt-3 overflow-x-auto rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
        <table className="w-full text-sm">
          <thead className="text-slate-500">
            <tr className="border-b border-slate-100 dark:border-white/10">
              <th className="text-left font-medium p-3 sticky left-0 bg-white dark:bg-slate-800 z-10">
                멤버
              </th>
              {MISSION_COLUMNS.map((col) => (
                <th
                  key={col.weekIndex}
                  className="p-3 font-medium text-center whitespace-nowrap text-xs"
                  title={col.label}
                >
                  {col.weekIndex + 1}{col.weekIndex === 12 ? '~14주' : '주'}
                </th>
              ))}
              <th className="p-3 font-medium text-center whitespace-nowrap">완주율</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ author, cells }) => (
              <tr
                key={author}
                className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <td className="p-3 font-medium sticky left-0 bg-white dark:bg-slate-800 z-10">
                  <Link href={`/members/${author}`} className="hover:text-brand transition-colors">
                    @{author}
                  </Link>
                </td>
                {cells.map((state, i) => (
                  <td key={i} className="p-3 text-center">
                    <span
                      title={CELL_LABEL[state]}
                      className={`inline-block w-6 h-6 rounded-md ${CELL_CLS[state]} hover:ring-2 hover:ring-offset-1 hover:ring-brand transition-all`}
                    />
                  </td>
                ))}
                <td className="p-3 text-center font-semibold">
                  {completionRate(cells)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 헬퍼 텍스트 */}
      <p className="mt-3 text-xs text-slate-400">
        행(멤버) 클릭 → 멤버 프로필 · 셀 hover → 상태 확인.
        {fallbackCount > 0 && (
          <> step 미상 <strong>{fallbackCount}</strong>건은 해당 레포 첫 주차로 집계했습니다.</>
        )}
      </p>
    </>
  );
}
