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
 * 1~3기 공용 커리큘럼 (노션상 1,2,3기는 미션 동일 — 11주. 단, 1기는 레포별 세부 제출 방식이 다름).
 * 4기는 커리큘럼이 다르므로(룰렛·좀비·whatever·pokemon) 별도 정의 예정.
 *
 * 1기 특이사항: racingcar·lotto를 단계 분할 없이 PR 1건("[N주차]" 또는 무표기 제목)으로 통짜 제출.
 * matchUnits의 racingcar/lotto 폴백(단계 매칭 실패 시 전 단계 완료 처리)이 이를 커버한다.
 */
function sharedCurriculum(cohort: CohortId): CatalogMission[] {
  return [
    // ── 프론트 ──
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

    // ── 백엔드 (nextstep 공용 레포 5종 — 접근 가능, 명부+날짜창으로 귀속) ──
    { cohort, track: 'BE', order: 0, label: '자동차 경주', repository: 'next-step/java-racingcar-simple-playground', introUrl: 'https://github.com/next-step/java-racingcar-simple-playground', note: '1~2주차',
      units: ['1', '2', '3', '4'].map((n) => ({ id: n, label: `${n}단계` })) },
    { cohort, track: 'BE', order: 1, label: '로또', repository: 'next-step/java-lotto-clean-playground', introUrl: 'https://github.com/next-step/java-lotto-clean-playground', note: '3~4주차',
      units: ['1', '2', '3', '4', '5'].map((n) => ({ id: n, label: `${n}단계` })) },
    { cohort, track: 'BE', order: 2, label: '사다리', repository: 'next-step/java-ladder-func-playground', introUrl: 'https://github.com/next-step/java-ladder-func-playground', note: '5주차 · 단일 제출',
      units: [{ id: '1', label: '제출' }] },
    { cohort, track: 'BE', order: 3, label: '방탈출① (JDBC)', repository: 'next-step/spring-roomescape-playground', introUrl: 'https://github.com/next-step/spring-roomescape-playground', note: '6~9주차 · Spring MVC·JDBC·Core',
      units: [{ id: 'mvc', label: 'MVC' }, { id: 'jdbc', label: 'JDBC' }, { id: 'core', label: 'Core' }] },
    { cohort, track: 'BE', order: 4, label: '방탈출② (JPA)', repository: 'next-step/spring-basic-roomescape-playground', introUrl: 'https://github.com/next-step/spring-basic-roomescape-playground', note: '11~14주차 · Spring MVC·JPA·Core',
      units: [{ id: 'mvc', label: 'MVC 인증' }, { id: 'jpa', label: 'JPA' }, { id: 'core', label: 'Core 배포' }] },
  ];
}

export const MISSION_CATALOG: CatalogMission[] = [
  ...sharedCurriculum(1),
  ...sharedCurriculum(2),
  ...sharedCurriculum(3),
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
      // 제목에 [Spring MVC/JDBC/Core] 페이즈명 명시 → 키워드 우선
      if (/MVC|인증/i.test(t)) got.add('mvc');
      if (/JDBC/i.test(t)) got.add('jdbc');
      if (/Core|배포/i.test(t)) got.add('core');
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
