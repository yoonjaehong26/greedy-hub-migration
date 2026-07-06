import type { Member } from '@/shared/core/types/roster';

/**
 * 멤버 명부 — 노션 정리본 기준. 파일럿은 3기 신입기수(미션 참여자) 10명만 확정 시드.
 * 다른 기수는 cross-cohort 판별에 필요한 만큼만 추가(예: 강동현의 2기 이력).
 * QA로 이름/아이디가 확정되면 이 파일을 직접 고친다 ("DB로 하드하게" 정리).
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
];

/** login 소문자 → Member 조회 (매칭은 항상 대소문자 무시). */
export const MEMBER_BY_LOGIN = new Map(MEMBERS.map((m) => [m.login.toLowerCase(), m]));
