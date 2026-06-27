/**
 * 미션 커리큘럼 14주 열 정의 (docs/missions.md 기반)
 * PR → weekIndex 매핑 전략:
 *   - 단일 레포 (1·2·3·13~14주): repo만으로 확정
 *   - 다주차 레포 (4~5·6~9·10~12주): PR 제목/브랜치에서 step 마커 정규식으로 추출
 *   - 폴백: 파싱 실패 시 해당 레포의 첫 주차로 귀속
 */

export interface MissionColumn {
  /** 0-based index */
  weekIndex: number;
  /** 표시 라벨 (예: "1주 숫자야구") */
  label: string;
  /** 대응 repository (org/repo 형태) */
  repository: string;
  /**
   * step 마커 (다주차 레포에서만 사용).
   * 문자열이면 PR 제목에서 이 step 값을 정규식으로 탐색.
   * null이면 repo만으로 확정 (단일 주차).
   */
  stepMarker: string | null;
}

export const MISSION_COLUMNS: MissionColumn[] = [
  { weekIndex: 0,  label: '1주 숫자야구',    repository: 'greedy-study/javascript-baseball-precourse', stepMarker: null },
  { weekIndex: 1,  label: '2주 룰렛',        repository: 'greedy-study/javascript-greedy-roulette',   stepMarker: null },
  { weekIndex: 2,  label: '3주 좀비',        repository: 'greedy-study/javascript-zombie-survival',   stepMarker: null },
  { weekIndex: 3,  label: '4주 React①~③',  repository: 'cho-log/self-paced-react',                  stepMarker: '1|2|3' },
  { weekIndex: 4,  label: '5주 React④~⑤',  repository: 'cho-log/self-paced-react',                  stepMarker: '4|5' },
  { weekIndex: 5,  label: '6주 심화①',       repository: 'greedy-study/self-paced-react-advanced',   stepMarker: '1(?![-.])' },
  { weekIndex: 6,  label: '7주 심화②-1',    repository: 'greedy-study/self-paced-react-advanced',   stepMarker: '2[-.]*1|2-1|adv-2\\.1' },
  { weekIndex: 7,  label: '8주 심화②-2',    repository: 'greedy-study/self-paced-react-advanced',   stepMarker: '2[-.]*2|2-2|adv-2\\.2' },
  { weekIndex: 8,  label: '9주 심화②-3',    repository: 'greedy-study/self-paced-react-advanced',   stepMarker: '2[-.]*3|2-3|adv-2\\.3' },
  { weekIndex: 9,  label: '10주 자유①',     repository: 'greedy-study/react-whatever-you-want',     stepMarker: '1(?![-.])' },
  { weekIndex: 10, label: '11주 자유②',     repository: 'greedy-study/react-whatever-you-want',     stepMarker: '2(?![-.])' },
  { weekIndex: 11, label: '12주 자유③',     repository: 'greedy-study/react-whatever-you-want',     stepMarker: '3(?![-.])' },
  // 13~14주: 2주 병합 셀 → 동일 weekIndex로 처리
  { weekIndex: 12, label: '13~14주 SSR',   repository: 'greedy-study/react-pokemon-ssr',           stepMarker: null },
];

/** 총 열 수 (마지막 주차+1: SSR은 index 12가 13~14주를 대표) */
export const TOTAL_WEEKS = 13;

/**
 * 단일 레포만으로 week를 확정할 수 있는 repo 집합
 * (stepMarker === null 인 레포들)
 */
const SINGLE_REPO_SET = new Set(
  MISSION_COLUMNS.filter((c) => c.stepMarker === null).map((c) => c.repository),
);

/**
 * 다주차 레포별 후보 열 목록 (stepMarker !== null)
 */
const MULTI_REPO_COLUMNS = new Map<string, MissionColumn[]>();
for (const col of MISSION_COLUMNS) {
  if (col.stepMarker !== null) {
    const list = MULTI_REPO_COLUMNS.get(col.repository) ?? [];
    list.push(col);
    MULTI_REPO_COLUMNS.set(col.repository, list);
  }
}

/**
 * PR 하나를 받아 해당하는 weekIndex를 반환한다.
 * @returns weekIndex (0-based) | null (이 레포가 커리큘럼에 없음)
 * @returns { weekIndex, isFallback } — isFallback=true 면 step 파싱 실패 → 첫 주차 귀속
 */
export function resolveWeekIndex(
  repository: string,
  title: string,
): { weekIndex: number; isFallback: boolean } | null {
  // 1. 단일 레포 확정
  if (SINGLE_REPO_SET.has(repository)) {
    const col = MISSION_COLUMNS.find((c) => c.repository === repository)!;
    return { weekIndex: col.weekIndex, isFallback: false };
  }

  // 2. 다주차 레포: step 마커 탐색
  const candidates = MULTI_REPO_COLUMNS.get(repository);
  if (!candidates) return null; // 커리큘럼 외 레포

  for (const col of candidates) {
    // col.stepMarker는 null이 아님 (위 필터에서 확정)
    const regex = new RegExp(col.stepMarker!, 'i');
    if (regex.test(title)) {
      return { weekIndex: col.weekIndex, isFallback: false };
    }
  }

  // 3. 폴백: 해당 레포의 첫 번째 열로 귀속
  return { weekIndex: candidates[0].weekIndex, isFallback: true };
}
