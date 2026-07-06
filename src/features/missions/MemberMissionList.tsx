'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMissionsQuery } from '@/shared/core/queries/missionQueries';
import { PILOT_COHORT } from '@/shared/core/constants/cohorts';
import type { Track } from '@/shared/core/types/roster';
import {
  buildMemberRows,
  outsiderSummary,
  type CellState,
  type UnitState,
  type MissionCell,
  type MemberRow,
} from './buildMemberRows';

const CELL: Record<CellState, { dot: string; label: string }> = {
  done:    { dot: 'bg-emerald-500', label: '완주' },
  pending: { dot: 'bg-amber-400',   label: '미머지(머지만)' },
  gap:     { dot: 'bg-rose-500',    label: 'PR 누락' },
  none:    { dot: 'bg-slate-300 dark:bg-white/15', label: '미착수' },
};

const UNIT: Record<UnitState, { pill: string; label: string }> = {
  merged:    { pill: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300', label: '머지' },
  submitted: { pill: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300', label: '미머지' },
  none:      { pill: 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400', label: '없음' },
};

const CARD = 'rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10';

export function MemberMissionList() {
  const { data: missions = [], isLoading, error } = useMissionsQuery();
  const [track, setTrack] = useState<Track>('FE');
  const [open, setOpen] = useState<Set<string>>(new Set());

  const cohort = PILOT_COHORT;
  const rows = buildMemberRows(missions, cohort, track);
  const { outsiderAuthors } = outsiderSummary(missions, cohort, track);
  const totalUnmapped = rows.reduce((s, r) => s + r.unmapped, 0);

  function toggle(login: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(login)) next.delete(login);
      else next.add(login);
      return next;
    });
  }

  return (
    <section className="mt-7">
      {/* 트랙 토글 + 요약 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 overflow-hidden text-sm">
          {(['FE', 'BE'] as Track[]).map((t) => (
            <button
              key={t}
              onClick={() => setTrack(t)}
              className={`px-4 py-1.5 font-medium transition-colors ${
                track === t ? 'bg-brand text-white' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {t === 'FE' ? '프론트' : '백엔드'}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">멤버 {rows.length}명</span>
          {totalUnmapped > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300" title="어느 단계에도 매핑 안 된 PR — 제목 규칙 예외. QA로 확인 필요">
              매핑불명 {totalUnmapped}건
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400" title="카탈로그 레포에 PR을 올렸지만 명부에 없는 작성자 (타 기수·비회원·테스트). 자동 제외됨.">
            명부밖 {outsiderAuthors}명 (제외)
          </span>
        </div>
      </div>

      {/* 범례 */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
        {(Object.keys(CELL) as CellState[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-1">
            <i className={`w-3 h-3 rounded-sm inline-block ${CELL[s].dot}`} />
            {CELL[s].label}
          </span>
        ))}
        <span className="text-slate-400">· 숫자 = 머지된 단계/총 단계</span>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-slate-500 text-center py-10">불러오는 중…</p>
      ) : error ? (
        <p className="mt-6 text-sm text-red-500 text-center py-10">데이터를 가져오지 못했습니다. GitHub 동기화를 먼저 실행해주세요.</p>
      ) : (
        <div className={`mt-4 ${CARD} divide-y divide-slate-100 dark:divide-white/10`}>
          {rows.map((row) => (
            <MemberItem key={row.member.login} row={row} expanded={open.has(row.member.login)} onToggle={() => toggle(row.member.login)} />
          ))}
        </div>
      )}
    </section>
  );
}

function MemberItem({ row, expanded, onToggle }: { row: MemberRow; expanded: boolean; onToggle: () => void }) {
  const { member, team, cells, mergedUnits, totalUnits, gapUnits, flags } = row;

  return (
    <div>
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
        <span className={`text-slate-400 text-xs transition-transform ${expanded ? 'rotate-90' : ''}`}>▶</span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{member.name}</span>
            <Link href={`/members/${member.login}`} onClick={(e) => e.stopPropagation()} className="text-sm text-slate-500 hover:text-brand">
              @{member.login}
            </Link>
            {team && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500">{team}</span>}
            {gapUnits > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300" title="PR 자체가 없는 미완 단계 — 머지로 해결 안 됨">
                🔴 PR 누락 {gapUnits}건
              </span>
            )}
          </div>
          {flags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {flags.map((f, i) => (
                <span key={i} className="text-[11px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300 ring-1 ring-amber-200/60 dark:ring-amber-400/20">
                  ⚠ {f}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 미니 셀 스트립 (미션별) */}
        <div className="hidden sm:flex gap-1">
          {cells.map((c, i) => (
            <i key={i} title={`${c.mission.label}: ${c.mergedUnits}/${c.totalUnits} (${CELL[c.state].label})`} className={`w-4 h-4 rounded-sm ${CELL[c.state].dot}`} />
          ))}
        </div>

        <span className="text-sm font-semibold tabular-nums whitespace-nowrap">
          {mergedUnits}<span className="text-slate-400 font-normal">/{totalUnits}</span>
          <span className="text-slate-400 font-normal text-xs"> 단계</span>
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 space-y-1.5">
          {cells.map((c) => (
            <MissionDetail key={c.mission.repository} cell={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function MissionDetail({ cell }: { cell: MissionCell }) {
  const { mission, units, mergedUnits, totalUnits, prs, unmapped } = cell;
  return (
    <div className="rounded-lg bg-slate-50 dark:bg-white/5 px-3 py-2">
      {/* 미션 헤더 */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-medium text-sm">{mission.label}</span>
        <span className="text-xs font-semibold tabular-nums text-slate-500">{mergedUnits}/{totalUnits} 단계</span>
        {mission.introUrl && (
          <a href={mission.introUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-brand">소개 ↗</a>
        )}
        {unmapped > 0 && (
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300" title="어느 단계에도 매핑 안 된 PR">매핑불명 {unmapped}</span>
        )}
      </div>

      {/* 단계별 뱃지 */}
      <div className="mt-1.5 flex flex-wrap gap-1">
        {units.map((u) => (
          <span key={u.id} className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${UNIT[u.state].pill}`} title={UNIT[u.state].label}>
            {u.label}
          </span>
        ))}
      </div>

      {/* PR 링크 */}
      {prs.length > 0 ? (
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
          {prs.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs font-mono hover:text-brand ${p.state === 'merged' ? 'text-emerald-600 dark:text-emerald-400' : p.state === 'open' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 line-through'}`}
              title={p.title}
            >
              PR #{p.prNumber}
              {p.state === 'open' && ' (미머지)'}
              {p.state === 'closed' && ' (닫힘)'}
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-1 text-xs text-slate-400">제출된 PR 없음</p>
      )}
    </div>
  );
}
