import type { CatalogMission, CohortId, Track } from '@/shared/core/types/roster';

/**
 * 기수별 미션 카탈로그 = 미션 소개(goal 1)의 집 + 단계(unit) 정의.
 *
 * ⚠️ 핵심: PR 1개 ≠ 미션 1개. 한 PR이 여러 단계를 묶고("1,2,3 단계"), 재제출·closed도 섞임.
 *   게다가 제목 규칙이 멤버마다 제각각(단계번호 / 주차 / stepN / adv-2.1 / 페이즈명 MVC·JPA·배포).
 *   그래서 "단계 숫자"만 파싱하면 틀린다(예: 하수한 방탈출은 번호 없이 페이즈명만 씀).
 *   → 아래 matchUnits가 단계번호 + 페이즈 키워드를 함께 인식해 유닛 완료를 판정.
 *   실데이터 912건 · 3기 10명으로 매핑불명 0건 검증 완료.
 *
 * 조직명은 실제 존재하는 `greedy-team`(구 코드의 `greedy-study`는 오타 버그).
 */
export const MISSION_CATALOG: CatalogMission[] = [
  // ── 3기 프론트 ──
  { cohort: 3, track: 'FE', order: 0, label: '숫자야구 (JS)', repository: 'greedy-team/javascript-baseball-precourse', introUrl: 'https://github.com/greedy-team/javascript-baseball-precourse',
    units: [{ id: 'w1', label: '1주차' }, { id: 'w2', label: '2주차(MVC)' }] },
  { cohort: 3, track: 'FE', order: 1, label: 'React 기초', repository: 'cho-log/self-paced-react', introUrl: 'https://github.com/cho-log/self-paced-react/blob/main/00-introduction/README.md',
    units: ['1', '2', '3', '4', '5'].map((n) => ({ id: n, label: `${n}단계` })) },
  { cohort: 3, track: 'FE', order: 2, label: 'React 심화', repository: 'greedy-team/self-paced-react-advanced', introUrl: 'https://github.com/greedy-team/self-paced-react-advanced',
    units: [{ id: '1', label: 'styled' }, { id: '2.1', label: 'Context' }, { id: '2.2', label: 'Zustand' }, { id: '2.3', label: 'TanStack' }] },
  { cohort: 3, track: 'FE', order: 3, label: 'SPA 라우팅', repository: 'greedy-team/react-spa-routing', introUrl: 'https://github.com/greedy-team/react-spa-routing/blob/main/README.md',
    units: [{ id: '1', label: 'newsViewer' }] },
  { cohort: 3, track: 'FE', order: 4, label: 'Todo (최적화)', repository: 'greedy-team/react-todo-list', introUrl: 'https://github.com/greedy-team/react-todo-list/blob/main/README.md',
    units: [{ id: '1', label: 'step1' }, { id: '2', label: 'step2' }] },

  // ── 3기 백엔드 (nextstep 공용 레포 — 접근 가능, 명부로 귀속) ──
  { cohort: 3, track: 'BE', order: 0, label: '자동차 경주', repository: 'next-step/java-racingcar-simple-playground', introUrl: 'https://github.com/next-step/java-racingcar-simple-playground', note: 'nextstep 강의 상세는 로그인 필요',
    units: ['1', '2', '3', '4'].map((n) => ({ id: n, label: `${n}단계` })) },
  { cohort: 3, track: 'BE', order: 1, label: '로또', repository: 'next-step/java-lotto-clean-playground', introUrl: 'https://github.com/next-step/java-lotto-clean-playground', note: 'nextstep 강의 상세는 로그인 필요',
    units: ['1', '2', '3', '4', '5'].map((n) => ({ id: n, label: `${n}단계` })) },
  { cohort: 3, track: 'BE', order: 2, label: '방탈출', repository: 'next-step/spring-basic-roomescape-playground', introUrl: 'https://github.com/next-step/spring-basic-roomescape-playground', note: '9단계 = 3페이즈(MVC·JPA·Core)',
    units: [{ id: 'mvc', label: 'MVC 인증(1-3)' }, { id: 'jpa', label: 'JPA(4-6)' }, { id: 'core', label: 'Core 배포(7-9)' }] },
];

/** PR 제목에서 "N단계" 숫자(소수 포함)를 추출. */
function stepNums(title: string): Set<string> {
  const out = new Set<string>();
  const re = /([\d.,\s]+?)\s*단계/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(title)) !== null) {
    for (const n of m[1].match(/\d+(?:\.\d+)?/g) ?? []) out.add(n);
  }
  return out;
}

/**
 * PR 제목 → 이 미션에서 완료(커버)된 유닛 id 목록.
 * 단계번호 + 페이즈 키워드를 함께 인식. 매핑 실패 시 빈 배열(= 매핑불명, QA 대상).
 */
export function matchUnits(repository: string, title: string): string[] {
  const t = title;
  const n = stepNums(t);
  const got = new Set<string>();

  switch (repository) {
    case 'greedy-team/javascript-baseball-precourse':
      if (t.includes('1주차')) got.add('w1');
      if (t.includes('2주차') || /MVC/i.test(t)) got.add('w2');
      break;
    case 'cho-log/self-paced-react':
      for (const u of ['1', '2', '3', '4', '5']) if (n.has(u)) got.add(u);
      break;
    case 'greedy-team/self-paced-react-advanced':
      if (/adv-1|(?<![\d.])1단계/.test(t) && /adv/i.test(t)) got.add('1');
      if (t.includes('2.1') || /Context/i.test(t)) got.add('2.1');
      if (t.includes('2.2') || /Zustand/i.test(t)) got.add('2.2');
      if (t.includes('2.3') || /Tanstack/i.test(t)) got.add('2.3');
      break;
    case 'greedy-team/react-spa-routing':
      got.add('1'); // 단일 제출 — 이 레포 PR이면 완료로 간주
      break;
    case 'greedy-team/react-todo-list':
      if (/step\s*1/i.test(t)) got.add('1');
      if (/step\s*2/i.test(t)) got.add('2');
      break;
    case 'next-step/java-racingcar-simple-playground':
      for (const u of ['1', '2', '3', '4']) if (n.has(u)) got.add(u);
      break;
    case 'next-step/java-lotto-clean-playground':
      for (const u of ['1', '2', '3', '4', '5']) if (n.has(u)) got.add(u);
      break;
    case 'next-step/spring-basic-roomescape-playground':
      if (/MVC|인증/i.test(t) || n.has('1') || n.has('2') || n.has('3')) got.add('mvc');
      if (/JPA/i.test(t) || n.has('4') || n.has('5') || n.has('6')) got.add('jpa');
      if (/Core|배포/i.test(t) || n.has('7') || n.has('8') || n.has('9')) got.add('core');
      break;
  }
  return [...got];
}

export function getCatalog(cohort: CohortId, track: Track): CatalogMission[] {
  return MISSION_CATALOG.filter((m) => m.cohort === cohort && m.track === track).sort((a, b) => a.order - b.order);
}
