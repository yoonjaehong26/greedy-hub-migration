import type { Member } from '@/shared/core/types/roster';

/**
 * 멤버 명부 — 노션 정리본(데모데이·기념비) 기준. 실데이터(PR 작성자) 교차검증 완료.
 * cross-cohort 멤버는 memberships 배열에 전 기수 이력을 담아 "중복기수" 플래그가 뜨게 함.
 * QA로 이름/아이디가 확정되면 이 파일을 직접 고친다 ("DB로 하드하게" 정리).
 * 확장 상태: 2·3기 완료. 4·1기 예정.
 */
export const MEMBERS: Member[] = [
  // ── 3기 두구두구 · 프론트 ──
  { login: 'yoonjaehong26', name: '윤재홍', memberships: [{ cohort: 3, track: 'FE', role: 'F', team: '두구두구' }] },
  {
    login: 'Johncakes',
    name: '심혁',
    note: 'GitHub login 대소문자 주의(johncakes). todo-list PR 미머지 이력 있음',
    memberships: [{ cohort: 3, track: 'FE', role: 'F', team: '두구두구' }],
  },
  // ── 3기 밋링크 · 프론트 ──
  { login: 'dkr-sjr', name: '강건', memberships: [{ cohort: 3, track: 'FE', role: 'F', team: '밋링크' }] },
  { login: 'ehlung', name: '강예령', memberships: [{ cohort: 3, track: 'FE', role: 'F', team: '밋링크' }] },

  // ── 3기 두구두구 · 백엔드 ──
  {
    login: 'mintcoke123',
    name: '강동현',
    note: 'cross-cohort: 2기 프론트 → 3기 백엔드. 2기 FE PR은 날짜창으로 자동 분리',
    memberships: [
      { cohort: 2, track: 'FE', role: 'F', team: '줍줍' },
      { cohort: 3, track: 'BE', role: 'B', team: '두구두구' },
    ],
  },
  { login: 'tae-wooo', name: '김태우', memberships: [{ cohort: 3, track: 'BE', role: 'B', team: '두구두구' }] },
  { login: 'ke-62', name: '이고은', note: '이름 확정: 이고은(기념비 기준)', memberships: [{ cohort: 3, track: 'BE', role: 'B', team: '두구두구' }] },
  // ── 3기 밋링크 · 백엔드 ──
  { login: 'chemistryx', name: '하수한', memberships: [{ cohort: 3, track: 'BE', role: 'B', team: '밋링크' }] },
  { login: 'nonactress', name: '서현진', note: '방탈출 PR 미머지 이력 있음', memberships: [{ cohort: 3, track: 'BE', role: 'B', team: '밋링크' }] },
  { login: 'kimsky247-coder', name: '김하늘', memberships: [{ cohort: 3, track: 'BE', role: 'B', team: '밋링크' }] },

  // ── 2기(2025-1) 슬종생 · 프론트 ──
  { login: 'zldn109', name: '신지우', memberships: [{ cohort: 2, track: 'FE', role: 'F', team: '슬종생' }] },
  {
    login: 'ChangwooJ',
    name: '정창우',
    note: 'cross-cohort: 1기 프론트(모꼬지) → 2기 프론트(슬종생)',
    memberships: [
      { cohort: 1, track: 'FE', role: 'F', team: '모꼬지' },
      { cohort: 2, track: 'FE', role: 'F', team: '슬종생' },
    ],
  },
  {
    login: 'developowl',
    name: '신지훈',
    note: 'cross-cohort: 1기 백엔드(따라행) → 2기 프론트(슬종생). 트랙 전환',
    memberships: [
      { cohort: 1, track: 'BE', role: 'B', team: '따라행' },
      { cohort: 2, track: 'FE', role: 'F', team: '슬종생' },
    ],
  },
  // ── 2기 줍줍 · 프론트 (강동현 mintcoke123은 위 3기 항목에 2기 FE 이력 포함) ──
  { login: 'gxuoo', name: '임규영', memberships: [{ cohort: 2, track: 'FE', role: 'F', team: '줍줍' }] },
  { login: 'INSANE-P', name: '박찬빈', memberships: [{ cohort: 2, track: 'FE', role: 'F', team: '줍줍' }] },

  // ── 2기 슬종생 · 백엔드 ──
  { login: 'gjtjrl303', name: '허석준', memberships: [{ cohort: 2, track: 'BE', role: 'B', team: '슬종생' }] },
  { login: 'JihwanYeom', name: '염지환', memberships: [{ cohort: 2, track: 'BE', role: 'B', team: '슬종생' }] },
  { login: 'Ji-Woo-Kim', name: '김지우', memberships: [{ cohort: 2, track: 'BE', role: 'B', team: '슬종생' }] },
  // ── 2기 줍줍 · 백엔드 ──
  { login: 'HyerimH', name: '황혜림', memberships: [{ cohort: 2, track: 'BE', role: 'B', team: '줍줍' }] },
  { login: 'chxghee', name: '이창희', memberships: [{ cohort: 2, track: 'BE', role: 'B', team: '줍줍' }] },
  { login: 'jeonseohee9', name: '전서희', memberships: [{ cohort: 2, track: 'BE', role: 'B', team: '줍줍' }] },
];

// 참고 — 1기 확장 시 추가할 멤버 (2기 명부에서 제외한 케이스 포함):
//   남해윤(haeyoon1): 1기 BE(따라행). 2기 줍줍 데모팀 명단엔 있으나 미션 수행은 1기 → 2기 명부 제외.
//   (developowl 신지훈·ChangwooJ 정창우는 위에 1기 이력 포함되어 있음)

/** login 소문자 → Member 조회 (매칭은 항상 대소문자 무시). */
export const MEMBER_BY_LOGIN = new Map(MEMBERS.map((m) => [m.login.toLowerCase(), m]));
