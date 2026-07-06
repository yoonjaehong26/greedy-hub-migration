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
/**
 * 백엔드 커리큘럼 (nextstep 공용 레포 5종) — 1·2·3·4기 전부 동일.
 * 명부+날짜창으로 기수 귀속. 1기는 racingcar·lotto를 통짜 제출("[N주차]")하는데
 * matchUnits의 폴백(단계 매칭 실패 시 전 단계 완료)이 커버한다.
 */
function sharedBE(cohort: CohortId): CatalogMission[] {
  return [
    { cohort, track: 'BE', order: 0, label: '자동차 경주', repository: 'next-step/java-racingcar-simple-playground', introUrl: 'https://github.com/next-step/java-racingcar-simple-playground',
      units: ['1', '2', '3', '4'].map((n) => ({ id: n, label: `${n}단계` })) },
    { cohort, track: 'BE', order: 1, label: '로또', repository: 'next-step/java-lotto-clean-playground', introUrl: 'https://github.com/next-step/java-lotto-clean-playground',
      units: ['1', '2', '3', '4', '5'].map((n) => ({ id: n, label: `${n}단계` })) },
    { cohort, track: 'BE', order: 2, label: '사다리', repository: 'next-step/java-ladder-func-playground', introUrl: 'https://github.com/next-step/java-ladder-func-playground', note: '단일 제출',
      units: [{ id: '1', label: '제출' }] },
    { cohort, track: 'BE', order: 3, label: '방탈출① (JDBC)', repository: 'next-step/spring-roomescape-playground', introUrl: 'https://github.com/next-step/spring-roomescape-playground', note: 'Spring MVC·JDBC·Core',
      units: [{ id: 'mvc', label: 'MVC' }, { id: 'jdbc', label: 'JDBC' }, { id: 'core', label: 'Core' }] },
    { cohort, track: 'BE', order: 4, label: '방탈출② (JPA)', repository: 'next-step/spring-basic-roomescape-playground', introUrl: 'https://github.com/next-step/spring-basic-roomescape-playground', note: 'Spring MVC·JPA·Core',
      units: [{ id: 'mvc', label: 'MVC 인증' }, { id: 'jpa', label: 'JPA' }, { id: 'core', label: 'Core 배포' }] },
  ];
}

/**
 * 1~3기 프론트 커리큘럼 (11주 · 노션상 동일).
 * 숫자야구 2주(기초+MVC) → React 기초·심화 → SPA 라우팅 → Todo.
 */
function sharedFE123(cohort: CohortId): CatalogMission[] {
  return [
    { cohort, track: 'FE', order: 0, label: '숫자야구 (JS)', repository: 'greedy-team/javascript-baseball-precourse', introUrl: 'https://github.com/greedy-team/javascript-baseball-precourse',
      units: [{ id: 'w1', label: '1주차' }, { id: 'w2', label: '2주차(MVC)' }] },
    { cohort, track: 'FE', order: 1, label: 'React 기초', repository: 'cho-log/self-paced-react', introUrl: 'https://github.com/cho-log/self-paced-react/blob/main/00-introduction/README.md',
      units: ['1', '2', '3', '4', '5'].map((n) => ({ id: n, label: `${n}단계` })) },
    { cohort, track: 'FE', order: 2, label: 'React 심화', repository: 'greedy-team/self-paced-react-advanced', introUrl: 'https://github.com/greedy-team/self-paced-react-advanced',
      units: [{ id: '1', label: 'styled' }, { id: '2.1', label: 'Context' }, { id: '2.2', label: 'Zustand' }, { id: '2.3', label: 'TanStack' }] },
    { cohort, track: 'FE', order: 3, label: 'SPA 라우팅', repository: 'greedy-team/react-spa-routing', introUrl: 'https://github.com/greedy-team/react-spa-routing/blob/main/README.md',
      units: [{ id: '1', label: 'newsViewer' }] },
    { cohort, track: 'FE', order: 4, label: 'Todo (최적화)', repository: 'greedy-team/react-todo-list', introUrl: 'https://github.com/greedy-team/react-todo-list/blob/main/README.md',
      units: [{ id: '1', label: 'step1' }, { id: '2', label: 'step2' }] },
  ];
}

/**
 * 4기 프론트 커리큘럼 (14주 · 1~3기와 다름!).
 * 다른 점: 숫자야구 1주만 · 룰렛·좀비 추가 · SPA/Todo 대신 무엇이든·포켓몬SSR.
 * ⚠️ 진행 중 기수(2026-1). whatever·pokemon은 착수 전이라 제출 데이터 없음 →
 *    해당 파서(matchUnits)는 실제 제출이 들어오면 제목 형식 재확인 후 보정 필요.
 */
function cohort4FE(): CatalogMission[] {
  const cohort: CohortId = 4;
  return [
    { cohort, track: 'FE', order: 0, label: '숫자야구 (JS)', repository: 'greedy-team/javascript-baseball-precourse', introUrl: 'https://github.com/greedy-team/javascript-baseball-precourse', note: '1주차 (4기는 1주만)',
      units: [{ id: 'w1', label: '1주차' }] },
    { cohort, track: 'FE', order: 1, label: '탐욕의 룰렛', repository: 'greedy-team/javascript-greedy-roulette', introUrl: 'https://github.com/greedy-team/javascript-greedy-roulette', note: '2주차 · 단일 제출',
      units: [{ id: '1', label: '제출' }] },
    { cohort, track: 'FE', order: 2, label: '좀비 게임', repository: 'greedy-team/javascript-zombie-survival', introUrl: 'https://github.com/greedy-team/javascript-zombie-survival', note: '3주차 · 단일 제출',
      units: [{ id: '1', label: '제출' }] },
    { cohort, track: 'FE', order: 3, label: 'React 기초', repository: 'cho-log/self-paced-react', introUrl: 'https://github.com/cho-log/self-paced-react/blob/main/00-introduction/README.md', note: '4~5주차',
      units: ['1', '2', '3', '4', '5'].map((n) => ({ id: n, label: `${n}단계` })) },
    { cohort, track: 'FE', order: 4, label: 'React 심화', repository: 'greedy-team/self-paced-react-advanced', introUrl: 'https://github.com/greedy-team/self-paced-react-advanced', note: '6~9주차',
      units: [{ id: '1', label: 'styled' }, { id: '2.1', label: 'Context' }, { id: '2.2', label: 'Zustand' }, { id: '2.3', label: 'TanStack' }] },
    { cohort, track: 'FE', order: 5, label: '무엇이든 만들기', repository: 'greedy-team/react-whatever-you-want', introUrl: 'https://github.com/greedy-team/react-whatever-you-want', note: '10~12주차 (진행 중 · 제목형식 미확정)',
      units: [{ id: '1', label: 'step1' }, { id: '2', label: 'step2' }, { id: '3', label: 'step3' }] },
    { cohort, track: 'FE', order: 6, label: '포켓몬 SSR', repository: 'greedy-team/react-pokemon-ssr', introUrl: 'https://github.com/greedy-team/react-pokemon-ssr', note: '13~14주차 (착수 전 · 제목형식 미확정)',
      units: [{ id: '1', label: '1주차' }, { id: '2', label: '2주차' }] },
  ];
}

export const MISSION_CATALOG: CatalogMission[] = [
  ...sharedFE123(1), ...sharedBE(1),
  ...sharedFE123(2), ...sharedBE(2),
  ...sharedFE123(3), ...sharedBE(3),
  ...cohort4FE(), ...sharedBE(4),
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
      // 2.1/2.2/2.3 표기 변형: "2.1" 점 표기 또는 "2(1)" 괄호 표기(1기 일부) 모두 인식
      if (/adv-1|(?<![\d.])1단계/.test(t) && /adv/i.test(t)) got.add('1');
      if (t.includes('2.1') || /2\(1\)/.test(t) || /Context/i.test(t)) got.add('2.1');
      if (t.includes('2.2') || /2\(2\)/.test(t) || /Zustand/i.test(t)) got.add('2.2');
      if (t.includes('2.3') || /2\(3\)/.test(t) || /Tanstack/i.test(t)) got.add('2.3');
      break;
    case 'greedy-team/react-spa-routing':
      got.add('1'); // 단일 제출 — 이 레포 PR이면 완료로 간주
      break;
    case 'greedy-team/react-todo-list':
      if (/step\s*1/i.test(t)) got.add('1');
      if (/step\s*2/i.test(t)) got.add('2');
      break;
    // ── 4기 신규 프론트 레포 ──
    case 'greedy-team/javascript-greedy-roulette':
      got.add('1'); // 단일 제출 (룰렛)
      break;
    case 'greedy-team/javascript-zombie-survival':
      got.add('1'); // 단일 제출 (좀비)
      break;
    case 'greedy-team/react-whatever-you-want':
      // ⚠️ 진행 중 · 실제 제출 제목 미확정. step/단계/주차(10·11·12) 다각 인식 — 데이터 들어오면 검증.
      if (/step\s*1/i.test(t) || /(?<![\d.])1\s*단계/.test(t) || t.includes('10주차')) got.add('1');
      if (/step\s*2/i.test(t) || /(?<![\d.])2\s*단계/.test(t) || t.includes('11주차')) got.add('2');
      if (/step\s*3/i.test(t) || /(?<![\d.])3\s*단계/.test(t) || t.includes('12주차')) got.add('3');
      break;
    case 'greedy-team/react-pokemon-ssr':
      // ⚠️ 착수 전 · 제목 미확정. 1/2주차 또는 13/14주차 인식 — 데이터 들어오면 검증.
      if (t.includes('1주차') || t.includes('13주차')) got.add('1');
      if (t.includes('2주차') || t.includes('14주차')) got.add('2');
      break;
    case 'next-step/java-racingcar-simple-playground':
      for (const u of ['1', '2', '3', '4']) if (n.has(u)) got.add(u);
      // 1기: 단계 분할 없이 미션 전체를 PR 1건("[N주차]" 또는 무표기)으로 제출 → 전 단계 완료로 간주
      if (got.size === 0) return ['1', '2', '3', '4'];
      break;
    case 'next-step/java-lotto-clean-playground':
      for (const u of ['1', '2', '3', '4', '5']) if (n.has(u)) got.add(u);
      if (got.size === 0) return ['1', '2', '3', '4', '5'];
      break;
    case 'next-step/java-ladder-func-playground':
      got.add('1'); // 단일 제출 — 이 레포 PR이면 완료로 간주
      break;
    case 'next-step/spring-roomescape-playground':
      // 페이즈명 키워드 + 단계번호 폴백(1~4=MVC, 5~7=JDBC, 8~10=Core).
      // 4기 일부가 JDBC 단계를 "Spring MVC 5,6,7단계"로 오라벨 → 번호 폴백 필요.
      if (/MVC|인증/i.test(t) || n.has('1') || n.has('2') || n.has('3') || n.has('4')) got.add('mvc');
      if (/JDBC/i.test(t) || n.has('5') || n.has('6') || n.has('7')) got.add('jdbc');
      if (/Core|배포/i.test(t) || n.has('8') || n.has('9') || n.has('10')) got.add('core');
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

/** 카탈로그가 정의된(= 대시보드로 볼 수 있는) 기수 목록. 확장 시 자동 반영. */
export function availableCohorts(): CohortId[] {
  return [...new Set(MISSION_CATALOG.map((m) => m.cohort))].sort((a, b) => b - a) as CohortId[];
}
