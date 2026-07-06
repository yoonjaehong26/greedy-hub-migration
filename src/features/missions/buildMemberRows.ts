import type { Mission } from '@/shared/core/types/mission';
import type { CatalogMission, CohortId, Member, Track } from '@/shared/core/types/roster';
import { COHORTS } from '@/shared/core/constants/cohorts';
import { MEMBERS } from '@/shared/core/constants/members';
import { getCatalog, matchUnits } from '@/shared/core/constants/missionCatalog';
import { OVERRIDE_BY_ID } from '@/shared/core/constants/prOverrides';

/**
 * 셀 상태(미션 단위):
 *  done    = 전 단계 머지 (완주)
 *  pending = 미완 단계가 전부 제출됨(open 또는 closed) → 머지/재오픈만 하면 됨
 *  gap     = 미완 단계 중 PR 자체가 아예 없는 게 있음 → 진짜 미제출
 *  none    = 이 미션에 제출된 PR이 하나도 없음 (미착수)
 */
export type CellState = 'done' | 'pending' | 'gap' | 'none';

/**
 * 단계 상태:
 *  merged    = 머지됨 (완료)
 *  submitted = open PR 있음 (미머지)
 *  closed    = 닫힌 PR만 있음 (제출했으나 머지 못 받음 — "누락"과 구분)
 *  none      = 어떤 PR도 없음 (진짜 미제출)
 */
export type UnitState = 'merged' | 'submitted' | 'closed' | 'none';

/** PR 한 건 + 이 PR이 커버하는 단계 라벨(매핑불명이면 빈 배열). */
export interface MissionPr {
  pr: Mission;
  unitLabels: string[];
}

/** 오버라이드로 제외된 PR (불참·부정행위 등) — 이유를 화면에 노출. */
export interface ExcludedPr {
  prNumber: number;
  url: string;
  note?: string;
}

export interface MissionCell {
  mission: CatalogMission;
  state: CellState;
  units: { id: string; label: string; state: UnitState }[];
  mergedUnits: number;   // 머지된 단계 수
  totalUnits: number;    // 총 단계 수
  prs: MissionPr[];      // 표시용 PR들 (머지·미머지만, 단계 순 정렬)
  closedHidden: number;  // 숨긴 닫힌 PR 수 (재제출/실수 — 집계·표시 제외)
  excluded: ExcludedPr[]; // 오버라이드로 제외된 PR (불참 등) — 이유 표기
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
  const closed = new Set<string>(); // 닫힌 PR이 덮는 단계
  let unmapped = 0;

  // 1차 패스: 머지/미머지 단계 확정. 닫힌 PR은 따로 모아둔다.
  const closedPrs: Mission[] = [];
  const openMergedList: (MissionPr & { _order: number })[] = [];
  const excluded: ExcludedPr[] = [];
  for (const pr of prs) {
    // 오버라이드 제외(불참·부정행위 등)는 어떤 단계에도 카운트 안 하고 이유만 기록.
    const ov = OVERRIDE_BY_ID.get(pr.id);
    if (ov?.status === 'exclude') {
      excluded.push({ prNumber: pr.prNumber, url: pr.url, note: ov.note });
      continue;
    }
    if (pr.state === 'closed') {
      closedPrs.push(pr);
      matchUnits(mission.repository, pr.title).forEach((u) => closed.add(u));
      continue;
    }
    const hit = matchUnits(mission.repository, pr.title);
    if (hit.length === 0) unmapped++;
    if (pr.state === 'merged') hit.forEach((u) => merged.add(u));
    else hit.forEach((u) => opened.add(u));
    const order = hit.length ? Math.min(...hit.map((id) => orderById.get(id) ?? 99)) : 99;
    openMergedList.push({ pr, unitLabels: hit.map((id) => labelById.get(id) ?? id), _order: order });
  }

  // 2차 패스: 닫힌 PR 분류.
  //  - 이미 머지/미머지된 단계만 덮음 → 재제출/실수 (숨김).
  //  - 머지/미머지 안 된 단계를 덮음 → 유일한 제출 증거 (표시, "닫힘" 상태).
  let closedHidden = 0;
  const closedList: (MissionPr & { _order: number })[] = [];
  for (const pr of closedPrs) {
    const hit = matchUnits(mission.repository, pr.title);
    const meaningful = hit.filter((u) => !merged.has(u) && !opened.has(u));
    if (meaningful.length === 0) {
      closedHidden++; // 전부 이미 처리된 단계 → 재제출
      continue;
    }
    const order = meaningful.length ? Math.min(...meaningful.map((id) => orderById.get(id) ?? 99)) : 99;
    closedList.push({ pr, unitLabels: hit.map((id) => labelById.get(id) ?? id), _order: order });
  }

  const prList = [...openMergedList, ...closedList].sort((a, b) => a._order - b._order || a.pr.prNumber - b.pr.prNumber);

  const units = mission.units.map((u) => ({
    id: u.id,
    label: u.label,
    state: (merged.has(u.id)
      ? 'merged'
      : opened.has(u.id)
        ? 'submitted'
        : closed.has(u.id)
          ? 'closed'
          : 'none') as UnitState,
  }));

  const mergedUnits = units.filter((u) => u.state === 'merged').length;
  const totalUnits = units.length;
  const hasNoPrUnit = units.some((u) => u.state === 'none'); // 어떤 PR도(닫힘 포함) 없는 단계
  const anyPr = units.some((u) => u.state !== 'none');

  let state: CellState;
  if (mergedUnits === totalUnits) state = 'done';
  else if (!anyPr) state = 'none'; // PR이 하나도 없음 (미착수)
  else if (hasNoPrUnit) state = 'gap'; // 일부 단계는 PR 자체가 없음 (진짜 미제출)
  else state = 'pending'; // 미완 단계 전부 제출됨(open 또는 closed)

  return {
    mission,
    state,
    units,
    mergedUnits,
    totalUnits,
    prs: prList.map(({ pr, unitLabels }) => ({ pr, unitLabels })),
    closedHidden,
    excluded,
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
    // exclude는 buildCell에서 이유와 함께 처리(여기서 드롭하지 않음). reassign만 여기서 거른다.
    const ov = OVERRIDE_BY_ID.get(pr.id);
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
