'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMissionsQuery } from '@/shared/core/queries/missionQueries';
import { COHORTS, PILOT_COHORT } from '@/shared/core/constants/cohorts';
import { availableCohorts } from '@/shared/core/constants/missionCatalog';
import type { CohortId, Track } from '@/shared/core/types/roster';
import type { Mission } from '@/shared/core/types/mission';
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
  pending: { dot: 'bg-amber-400',   label: '제출·미머지' },
  gap:     { dot: 'bg-rose-500',    label: 'PR 누락(미제출)' },
  none:    { dot: 'bg-slate-300 dark:bg-white/15', label: '미착수' },
};

// 진행 중 기수: "현재 하는 미션"(= 프론티어: 마지막으로 활동한 미션)만 남색 "진행 중".
//  - 프론티어가 pending(미머지 제출·리뷰대기) 또는 gap(뒤 단계 예정)이면 남색.
//  - 초반의 밀린 미머지(프론티어 아님)는 그대로 노랑(제출·미머지) — 머지 대상임을 표시.
// 완주(초록)·미착수(회색)는 그대로.
function cellView(state: CellState, ongoing: boolean, isFrontier: boolean): { dot: string; label: string } {
  if (ongoing && isFrontier && (state === 'pending' || state === 'gap')) return { dot: 'bg-indigo-400', label: '진행 중' };
  return CELL[state];
}

// 진행 중 기수 범례(프론티어 개념 반영 — cellView로 못 유도하므로 명시).
const ONGOING_LEGEND = [
  { dot: 'bg-emerald-500', label: '완주' },
  { dot: 'bg-indigo-400', label: '진행 중(현재 미션)' },
  { dot: 'bg-amber-400', label: '미머지(밀림)' },
  { dot: 'bg-slate-300 dark:bg-white/15', label: '미착수/예정' },
];

const UNIT: Record<UnitState, { pill: string; label: string }> = {
  merged:    { pill: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300', label: '머지' },
  submitted: { pill: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300', label: '미머지' },
  closed:    { pill: 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 line-through', label: '닫힘(제출)' },
  none:      { pill: 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500', label: '미제출' },
};

const PR_STATE: Record<Mission['state'], { label: string; cls: string }> = {
  merged: { label: '머지', cls: 'text-emerald-600 dark:text-emerald-400' },
  open:   { label: '미머지', cls: 'text-amber-600 dark:text-amber-400' },
  closed: { label: '닫힘', cls: 'text-slate-400 line-through' },
};

// 진행 중 기수의 "현재 미션"(프론티어) 안에서는 미머지도 남색(진행 중)으로 — 셀 색과 일관.
const UNIT_ONGOING_PILL = 'bg-indigo-100 text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-300';
const PR_OPEN_ONGOING_CLS = 'text-indigo-600 dark:text-indigo-400';

const CARD = 'rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10';

export function MemberMissionList() {
  const { data: missions = [], isLoading, error } = useMissionsQuery();
  const cohorts = availableCohorts();
  const [cohort, setCohort] = useState<CohortId>(PILOT_COHORT);
  const [track, setTrack] = useState<Track>('FE');
  const [open, setOpen] = useState<Set<string>>(new Set());

  const ongoing = COHORTS[cohort].ongoing;
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
      {/* 기수 + 트랙 토글 + 요약 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* 기수 선택 */}
          <div className="inline-flex rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 overflow-hidden text-sm">
            {cohorts.map((c) => (
              <button
                key={c}
                onClick={() => { setCohort(c); setOpen(new Set()); }}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  cohort === c ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {COHORTS[c].label}
              </button>
            ))}
          </div>
          {/* 트랙 선택 */}
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

      {/* 진행 중 기수 안내 */}
      {ongoing && (
        <p className="mt-2 text-xs text-indigo-600 dark:text-indigo-400">
          ⏳ 진행 중인 기수({COHORTS[cohort].label}) — <b>현재 하는 미션</b>만 진행 중(남색), 초반의 밀린 미머지는 노랑으로 남깁니다. 완주 판정은 종료 후. 개별 판단은 멤버 플래그(미션 포기 등)로.
        </p>
      )}

      {/* 범례 */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
        {(ongoing ? ONGOING_LEGEND : Object.values(CELL)).map((v) => (
          <span key={v.label} className="inline-flex items-center gap-1">
            <i className={`w-3 h-3 rounded-sm inline-block ${v.dot}`} />
            {v.label}
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
            <MemberItem key={row.member.login} row={row} ongoing={ongoing} expanded={open.has(row.member.login)} onToggle={() => toggle(row.member.login)} />
          ))}
        </div>
      )}
    </section>
  );
}

function MemberItem({ row, ongoing, expanded, onToggle }: { row: MemberRow; ongoing: boolean; expanded: boolean; onToggle: () => void }) {
  const { member, team, cells, mergedUnits, totalUnits, gapUnits, flags } = row;
  // 프론티어 = 마지막으로 활동(제출)한 미션. 진행 중 기수에서 이 미션만 "진행 중"(남색).
  const frontierIdx = cells.reduce((f, c, i) => (c.state !== 'none' ? i : f), -1);

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
            {gapUnits > 0 && !ongoing && (
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
          {cells.map((c, i) => {
            const v = cellView(c.state, ongoing, i === frontierIdx);
            return <i key={i} title={`${c.mission.label}: ${c.mergedUnits}/${c.totalUnits} (${v.label})`} className={`w-4 h-4 rounded-sm ${v.dot}`} />;
          })}
        </div>

        <span className="text-sm font-semibold tabular-nums whitespace-nowrap">
          {mergedUnits}<span className="text-slate-400 font-normal">/{totalUnits}</span>
          <span className="text-slate-400 font-normal text-xs"> 단계</span>
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 space-y-1.5">
          {cells.map((c, i) => (
            <MissionDetail key={c.mission.repository} cell={c} ongoing={ongoing} isFrontier={i === frontierIdx} />
          ))}
        </div>
      )}
    </div>
  );
}

const UNIT_GAP_PILL = 'bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300';

function MissionDetail({ cell, ongoing, isFrontier }: { cell: MissionCell; ongoing: boolean; isFrontier: boolean }) {
  const { mission, state, units, mergedUnits, totalUnits, prs, unmapped, closedHidden, excluded } = cell;
  const inProgress = ongoing && isFrontier; // 진행 중 기수의 현재 미션 → 미머지도 남색
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

      {/* 단계별 상태 뱃지 (요약). gap 미션에서 PR 자체가 없는 단계는 빨강으로 구분 */}
      <div className="mt-1.5 flex flex-wrap gap-1">
        {units.map((u) => {
          // 진행 중 기수에선 PR 없는 단계를 빨강으로 강조하지 않음(아직 안 온 단계).
          const isGapUnit = !ongoing && state === 'gap' && u.state === 'none';
          const pill = isGapUnit
            ? UNIT_GAP_PILL
            : inProgress && u.state === 'submitted'
              ? UNIT_ONGOING_PILL
              : UNIT[u.state].pill;
          return (
            <span key={u.id} className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${pill}`} title={isGapUnit ? 'PR 누락 — 머지로 해결 안 됨' : UNIT[u.state].label}>
              {u.label}
            </span>
          );
        })}
      </div>

      {/* PR 목록 — 단계별 라벨 (각 PR이 무슨 단계인지) */}
      {prs.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {prs.map(({ pr, unitLabels }) => (
            <li key={pr.id} className="flex items-center gap-2 flex-wrap text-xs">
              {/* 이 PR이 커버하는 단계 */}
              <span className="flex flex-wrap gap-1">
                {unitLabels.length > 0 ? (
                  unitLabels.map((l, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {l}
                    </span>
                  ))
                ) : (
                  <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300" title="어느 단계에도 매핑 안 됨">
                    매핑불명
                  </span>
                )}
              </span>
              <span className="text-slate-300 dark:text-slate-600">→</span>
              {(() => {
                const prCls = inProgress && pr.state === 'open' ? PR_OPEN_ONGOING_CLS : PR_STATE[pr.state].cls;
                return (
                  <>
                    <a href={pr.url} target="_blank" rel="noopener noreferrer" title={pr.title} className={`font-mono hover:underline ${prCls}`}>
                      PR #{pr.prNumber}
                    </a>
                    <span className={prCls}>{PR_STATE[pr.state].label}</span>
                  </>
                );
              })()}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-xs text-slate-400">제출된 PR 없음</p>
      )}

      {closedHidden > 0 && (
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">닫힌 PR {closedHidden}건 숨김 (재제출·실수)</p>
      )}

      {excluded.map((e) => (
        <p key={e.prNumber} className="mt-1 text-[11px] text-rose-600 dark:text-rose-300">
          🚫 불참 처리: {e.note ?? '오버라이드 제외'}{' '}
          <a href={e.url} target="_blank" rel="noopener noreferrer" className="font-mono underline">PR #{e.prNumber}</a>
        </p>
      ))}
    </div>
  );
}
