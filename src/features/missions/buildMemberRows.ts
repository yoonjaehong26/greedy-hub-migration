import type { Mission } from '@/shared/core/types/mission';
import type { CatalogMission, CohortId, Member, Track } from '@/shared/core/types/roster';
import { COHORTS } from '@/shared/core/constants/cohorts';
import { MEMBERS } from '@/shared/core/constants/members';
import { getCatalog, matchUnits } from '@/shared/core/constants/missionCatalog';
import { OVERRIDE_BY_ID } from '@/shared/core/constants/prOverrides';

/**
 * 셀 상태(미션 단위):
 *  done    = 전 단계 머지 (완주)
 *  pending = 미완 단계가 전부 open PR 보유 → 머지만 하면 됨
 *  gap     = 미완 단계 중 PR 자체가 없는 게 있음 → 머지로 해결 안 됨 (진짜 누락)
 *  none    = 이 미션에 제출된 PR이 하나도 없음 (미착수)
 */
export type CellState = 'done' | 'pending' | 'gap' | 'none';

export type UnitState = 'merged' | 'submitted' | 'none';

/** PR 한 건 + 이 PR이 커버하는 단계 라벨(매핑불명이면 빈 배열). */
export interface MissionPr {
  pr: Mission;
  unitLabels: string[];
}

export interface MissionCell {
  mission: CatalogMission;
  state: CellState;
  units: { id: string; label: string; state: UnitState }[];
  mergedUnits: number;   // 머지된 단계 수
  totalUnits: number;    // 총 단계 수
  prs: MissionPr[];      // 표시용 PR들 (머지·미머지만, 단계 순 정렬)
  closedHidden: number;  // 숨긴 닫힌 PR 수 (재제출/실수 — 집계·표시 제외)
  unmapped: number;      // 어떤 단계에도 매핑 안 된 PR 수 (머지·미머지 기준, QA 대상)
}

export interface MemberRow {
  member: Member;
  team?: string;
  cells: MissionCell[];
  mergedUnits: number;   // 완료 단계 합
  totalUnits: number;    // 전체 단계 합
  unmapped: number;      // 매핑불명 PR 합
  gapUnits: number;      // PR 자체가 없는 미완 단계 수 (머지로 해결 안 됨)
  flags: string[];
}

function inCohortWindow(iso: string, cohort: CohortId): boolean {
  const c = COHORTS[cohort];
  return iso >= c.startDate && iso <= c.endDate;
}

function memberFlags(member: Member, cohort: CohortId): string[] {
  const flags: string[] = [];
  if (member.withdrawn) flags.push('탈퇴');
  if (member.memberships.length > 1) {
    const others = member.memberships.filter((m) => m.cohort !== cohort).map((m) => `${m.cohort}기 ${m.track}`);
    if (others.length) flags.push(`중복기수(${others.join('·')})`);
  }
  if (member.note) flags.push(member.note);
  return flags;
}

/** 한 멤버의 한 미션(레포) PR들 → 단계별 상태 셀. */
function buildCell(mission: CatalogMission, prs: Mission[]): MissionCell {
  const labelById = new Map(mission.units.map((u) => [u.id, u.label]));
  const orderById = new Map(mission.units.map((u, i) => [u.id, i]));
  const merged = new Set<string>();
  const opened = new Set<string>();
  let unmapped = 0;
  let closedHidden = 0;

  // 닫힌 PR(재제출·실수)은 표시·집계에서 제외. 머지/미머지만 단계 매핑.
  const prList: (MissionPr & { _order: number })[] = [];
  for (const pr of prs) {
    if (pr.state === 'closed') {
      closedHidden++;
      continue;
    }
    const hit = matchUnits(mission.repository, pr.title);
    if (hit.length === 0) unmapped++;
    if (pr.state === 'merged') hit.forEach((u) => merged.add(u));
    else if (pr.state === 'open') hit.forEach((u) => opened.add(u));
    const order = hit.length ? Math.min(...hit.map((id) => orderById.get(id) ?? 99)) : 99;
    prList.push({ pr, unitLabels: hit.map((id) => labelById.get(id) ?? id), _order: order });
  }
  // 단계 순 → 같은 단계면 PR 번호 순
  prList.sort((a, b) => a._order - b._order || a.pr.prNumber - b.pr.prNumber);

  const units = mission.units.map((u) => ({
    id: u.id,
    label: u.label,
    state: (merged.has(u.id) ? 'merged' : opened.has(u.id) ? 'submitted' : 'none') as UnitState,
  }));

  const mergedUnits = units.filter((u) => u.state === 'merged').length;
  const totalUnits = units.length;
  const hasNoPrUnit = units.some((u) => u.state === 'none'); // 어떤 PR도 커버 못 한 단계
  const anyProgress = units.some((u) => u.state !== 'none');

  let state: CellState;
  if (mergedUnits === totalUnits) state = 'done';
  else if (!anyProgress) state = 'none'; // 머지·미머지 없음 (닫힌 PR만 있어도 미착수)
  else if (hasNoPrUnit) state = 'gap'; // 진행했지만 PR 없는 단계가 남음
  else state = 'pending'; // 미완 단계 전부 open PR → 머지만 하면 됨

  return {
    mission,
    state,
    units,
    mergedUnits,
    totalUnits,
    prs: prList.map(({ pr, unitLabels }) => ({ pr, unitLabels })),
    closedHidden,
    unmapped,
  };
}

/**
 * 선택 기수·트랙의 멤버별 미션 현황을 단계 단위로 계산.
 * 귀속: 명부 멤버 + PR작성자 일치 + createdAt 날짜창 + 카탈로그 레포 + 오버라이드.
 */
export function buildMemberRows(missions: Mission[], cohort: CohortId, track: Track): MemberRow[] {
  const catalog = getCatalog(cohort, track);
  const catalogRepos = new Set(catalog.map((m) => m.repository));

  const members = MEMBERS.filter((m) => m.memberships.some((ms) => ms.cohort === cohort && ms.track === track));

  // author(소문자) → 귀속된 PR들
  const prsByAuthor = new Map<string, Mission[]>();
  for (const pr of missions) {
    if (!catalogRepos.has(pr.repository)) continue;
    if (!inCohortWindow(pr.createdAt, cohort)) continue;
    const ov = OVERRIDE_BY_ID.get(pr.id);
    if (ov?.status === 'exclude') continue;
    if (ov?.reassignCohort && ov.reassignCohort !== cohort) continue;
    const key = pr.author.toLowerCase();
    const list = prsByAuthor.get(key) ?? [];
    list.push(pr);
    prsByAuthor.set(key, list);
  }

  const rows: MemberRow[] = members.map((member) => {
    const myPrs = prsByAuthor.get(member.login.toLowerCase()) ?? [];
    const team = member.memberships.find((m) => m.cohort === cohort && m.track === track)?.team;

    const cells = catalog.map((mission) => buildCell(mission, myPrs.filter((p) => p.repository === mission.repository)));

    return {
      member,
      team,
      cells,
      mergedUnits: cells.reduce((s, c) => s + c.mergedUnits, 0),
      totalUnits: cells.reduce((s, c) => s + c.totalUnits, 0),
      unmapped: cells.reduce((s, c) => s + c.unmapped, 0),
      // PR 없는 미완 단계 = gap 미션 안에서 state 'none'인 단계 수
      gapUnits: cells.filter((c) => c.state === 'gap').reduce((s, c) => s + c.units.filter((u) => u.state === 'none').length, 0),
      flags: memberFlags(member, cohort),
    };
  });

  // 완료 단계 수 내림차순 → 이름 오름차순
  rows.sort((a, b) => b.mergedUnits - a.mergedUnits || a.member.name.localeCompare(b.member.name, 'ko'));
  return rows;
}

/** 명부밖 작성자(타기수·비회원·테스트) 요약 — 개별 큐 대신 카운트만. */
export function outsiderSummary(missions: Mission[], cohort: CohortId, track: Track): { outsiderAuthors: number } {
  const catalog = getCatalog(cohort, track);
  const catalogRepos = new Set(catalog.map((m) => m.repository));
  const memberLogins = new Set(
    MEMBERS.filter((m) => m.memberships.some((ms) => ms.cohort === cohort && ms.track === track)).map((m) => m.login.toLowerCase()),
  );
  const outsiders = new Set<string>();
  for (const pr of missions) {
    if (!catalogRepos.has(pr.repository)) continue;
    if (!inCohortWindow(pr.createdAt, cohort)) continue;
    const a = pr.author.toLowerCase();
    if (!memberLogins.has(a)) outsiders.add(a);
  }
  return { outsiderAuthors: outsiders.size };
}
