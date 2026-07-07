import type { Member } from '@/shared/core/types/roster';

/**
 * 멤버 명부 — 노션 정리본(데모데이·기념비) 기준. 실데이터(PR 작성자) 교차검증 완료.
 * cross-cohort 멤버는 memberships 배열에 전 기수 이력을 담아 "중복기수" 플래그가 뜨게 함.
 * QA로 이름/아이디가 확정되면 이 파일을 직접 고친다 ("DB로 하드하게" 정리).
 * 확장 상태: 1·2·3기 완료. 4기 진행 중(FE 커리큘럼 상이 · whatever·pokemon 착수 전).
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
    note: '노션 명부엔 1기 모꼬지로도 기재되어 있었으나, 실데이터상 미션 PR은 전부 2기 창(2025-03~07)에만 존재 → 2기 전담으로 정정(1기 이력 제거)',
    memberships: [{ cohort: 2, track: 'FE', role: 'F', team: '슬종생' }],
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

  // ── 1기(2024-2) 모꼬지 · 프론트 ──
  // 신혁수·방재경: 그리디 멤버 아님으로 확인(2026-07-06) → 명부에서 제외.
  //   (노션 데모데이 명부엔 있었으나, 실제 그리디 소속이 아니었음. 이전엔 "미션 PR 0건"으로 QA 대기 중이었음.)

  // ── 1기 따라행 · 프론트 ──
  { login: 'Songhyejeong', name: '송혜정', memberships: [{ cohort: 1, track: 'FE', role: 'F', team: '따라행' }] },
  { login: 'gogo1414', name: '김준수', memberships: [{ cohort: 1, track: 'FE', role: 'F', team: '따라행' }] },

  // ── 1기 모꼬지 · 백엔드 ──
  { login: 'c0mpuTurtle', name: '신혜빈', memberships: [{ cohort: 1, track: 'BE', role: 'B', team: '모꼬지' }] },
  { login: 'goldm0ng', name: '안금서', memberships: [{ cohort: 1, track: 'BE', role: 'B', team: '모꼬지' }] },
  { login: 'davidolleh', name: '황승준', memberships: [{ cohort: 1, track: 'BE', role: 'B', team: '모꼬지' }] },
  { login: 'sansan20535', name: '김의진', memberships: [{ cohort: 1, track: 'BE', role: 'B', team: '모꼬지' }] },

  // ── 1기 따라행 · 백엔드 (신지훈은 위 2기 항목에 1기 이력 포함) ──
  { login: 'haeyoon1', name: '남해윤', note: '2기 줍줍 데모팀 명단에도 있으나 미션 수행은 전부 1기 창 → 1기 전담', memberships: [{ cohort: 1, track: 'BE', role: 'B', team: '따라행' }] },
  { login: 'SANGHEEJEONG', name: '정상희', memberships: [{ cohort: 1, track: 'BE', role: 'B', team: '따라행' }] },

  // 박예은(ye6194)·배강현(bae-kh): 그리디 멤버 아님으로 확인(2026-07-06) → 명부에서 제외.
  //   (PR 이력은 있었으나 실제 그리디 소속이 아니었음. 이전엔 "탈퇴 멤버"로 분류 중이었음.)

  // ── 4기(2026-1) 프론트 — 진행 중 (팀 정보 노션 미기재) ──
  { login: 'kokunut', name: '고규민', memberships: [{ cohort: 4, track: 'FE', role: 'F' }] },
  { login: 'realcdh', name: '천동현', memberships: [{ cohort: 4, track: 'FE', role: 'F' }] },
  { login: 'EM-H20', name: '홍의민', memberships: [{ cohort: 4, track: 'FE', role: 'F' }] },
  { login: 'rahwan10', name: '김동건', memberships: [{ cohort: 4, track: 'FE', role: 'F' }] },
  // ── 4기 백엔드 — 진행 중 (1~3기와 동일 5개 nextstep 레포) ──
  { login: 'hapdaypy', name: '김민욱', memberships: [{ cohort: 4, track: 'BE', role: 'B' }] },
  { login: 'htdufhc-bit', name: '정명준', memberships: [{ cohort: 4, track: 'BE', role: 'B' }] },
  { login: 'Kdahyn', name: '강대현', memberships: [{ cohort: 4, track: 'BE', role: 'B' }] },
  { login: 'Cappucciyes', name: '이태규', abandoned: true, memberships: [{ cohort: 4, track: 'BE', role: 'B' }] },
  { login: 'chaehyunL', name: '이채현', memberships: [{ cohort: 4, track: 'BE', role: 'B' }] },
  { login: 'haeun92e0', name: '김하은', memberships: [{ cohort: 4, track: 'BE', role: 'B' }] },
];

/** login 소문자 → Member 조회 (매칭은 항상 대소문자 무시). */
export const MEMBER_BY_LOGIN = new Map(MEMBERS.map((m) => [m.login.toLowerCase(), m]));
