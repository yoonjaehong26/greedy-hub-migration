/**
 * members.ts — 멤버 목 데이터
 *
 * 출처: 노션 "그리디 멤버 최종 정리(혜빈님 정리본)" 페이지 — 그리디 전체(46명) + 1~4기 개별 DB.
 * 이 페이지를 멤버 목록의 SOT로 채택(2026-07-10) — 이전엔 미션 대시보드 로스터(PR 미션을 실제로 수행한
 * 39명)만 반영했으나, 창립멤버 5명(리드·메인테이너로만 활동, PR 미션 없음)과 영입리드 2명이 빠져 있었음.
 * 기수별 DB의 role(다중선택: L=동아리장, M=메인테이너, FL/BL=리드, FR/BR=리뷰어, F1~F4/B1~B4=해당 기수 트랙
 * 스터디원)을 그대로 memberships[].roles로 매핑 — 더 이상 전원 '멤버' 고정이 아니라 실제 리드·메인테이너·
 * 동아리장 이력이 들어있다.
 * 외부 리뷰어 10명(비회원, 트랙별 PR 리뷰만 담당 — 김의천·송은우·백경환·정다빈·조승현·신동훈·최혜령·정수영·
 * 김민석·조상준)은 그리디 동아리원이 아니라서 이 목록에서 제외(승인됨) — 필요해지면 별도 자료구조로.
 * `department`(학과)·`admissionYear`(학번)·`joinType`(창립/영입리드 — 정규 기수 합류가 아닌 예외만 표기)은
 * 이번 작업에서 스키마에 추가됐지만 아직 UI에는 노출하지 않음(승인됨, 추후 필요시 사용).
 * `team`(데모데이팀)은 1~3기만 노션에 기재돼 있어 4기·창립·영입리드는 값 없음.
 * cross-cohort 트랙 전환자: 신지훈(1기 BE→2기 FE→3기 BE), 강동현(2기 FE→3기 BE) 등 memberships[] 배열로 표현.
 * `missionDashboardUrl`·`team`은 이전 목업 작업(2026-07-06)에서 추가된 필드로 backend-api-spec.md §3에 반영됨.
 *
 * 타입은 `shared/core/types/member.ts`(실제 API 계약)에서 파생 — 목업 전용으로 별도 정의하지 않는다.
 * 예전엔 Track·MemberRoleLabel·MockMember 등을 여기서 손으로 다시 선언해 실계약과 두 벌로 관리됐는데
 * (리네이밍할 때마다 양쪽을 매번 손으로 맞춰야 했음), `MemberDetail`을 그대로 가져와 필수 필드만 남기고
 * 나머지를 Partial로 완화하는 방식으로 통일(2026-07-10) — 실계약에 필드가 추가·변경되면 여기도 자동 반영.
 */

import type { MemberDetail } from '@/shared/core/types/member';

/**
 * id·login·name·school·avatarUrl·memberships는 모든 멤버가 실제로 갖고 있어 필수로 유지하고,
 * 나머지(bio·isPublic·summaryCounts·완료미션/블로그/팀프로젝트/활동 목록 등)는 목업 항목마다
 * 풀 프로필을 채우지 않아도 되도록 전부 선택으로 완화한다. 응답 시점엔 핸들러(`mocks/handlers/members.ts`)가
 * `?? 기본값`으로 채워 넣어 실제 응답은 항상 `MemberDetail` 전체를 만족한다.
 */
export type MockMember = Pick<MemberDetail, 'id' | 'login' | 'name' | 'school' | 'avatarUrl' | 'memberships'> &
  Partial<Omit<MemberDetail, 'id' | 'login' | 'name' | 'school' | 'avatarUrl' | 'memberships'>>;

export const MEMBERS: MockMember[] = [
  // ── 운영진(창립·영입리드) ──
  {
    id: 1,
    login: 'kokodak',
    name: '이승용',
    school: '세종대학교',
    department: ['컴퓨터공학과'],
    admissionYear: 20,
    joinType: '창립',
    avatarUrl: null,
    missionDashboardUrl: '/missions?cohort=3&track=BE',
    memberships: [
      { cohort: 1, track: 'BE', roles: ['동아리장', '메인테이너', '리드', '리뷰어'] },
      { cohort: 2, track: 'BE', roles: ['동아리장', '메인테이너', '리드', '리뷰어'] },
      { cohort: 3, track: 'BE', roles: ['동아리장', '메인테이너'] },
    ],
    bio: '그리디를 만든 사람. 요즘은 코드보다 리뷰·운영에 시간을 더 씁니다.',
    isPublic: true,
    // 창립멤버는 리드·운영 중심이라 PR 미션 자체를 수행하지 않음 — completedMissions가 항상 빈 배열인 정상 케이스.
    summaryCounts: { completedMissions: 0, teamProjects: 0, blogPosts: 1 },
    completedMissions: [],
    blogPosts: [
      { postId: 5, title: '그리디 1기를 시작하며', category: '회고', relativeDate: '1년 전' },
    ],
    teamProjects: [],
    activities: [
      { activityId: 5, date: '2024.09', tag: '창립', title: '그리디 창립' },
    ],
  },
  { id: 2, login: 'TaeyeonRoyce', name: '원태연', school: '세종대학교', department: ['에너지자원공학과'], admissionYear: 18, joinType: '창립', avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=BE', memberships: [{ cohort: 1, track: 'BE', roles: ['메인테이너', '리드', '리뷰어'] }, { cohort: 2, track: 'BE', roles: ['메인테이너', '리뷰어'] }] },
  { id: 3, login: 'boyekim', name: '김수민', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 21, joinType: '창립', avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 1, track: 'BE', roles: ['메인테이너'] }, { cohort: 2, track: 'BE', roles: ['메인테이너'] }, { cohort: 3, track: 'BE', roles: ['메인테이너'] }, { cohort: 4, track: 'BE', roles: ['리뷰어'] }] },
  { id: 4, login: 'Indigochi1d', name: '김범수', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 19, joinType: '창립', avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=FE', memberships: [{ cohort: 1, track: 'FE', roles: ['메인테이너', '리드', '리뷰어'] }, { cohort: 2, track: 'FE', roles: ['메인테이너', '리드', '리뷰어'] }, { cohort: 3, track: 'FE', roles: ['리뷰어'] }, { cohort: 4, track: 'FE', roles: ['메인테이너', '리드', '리뷰어'] }] },
  { id: 5, login: '3Juhwan', name: '김주환', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 20, joinType: '창립', avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=BE', memberships: [{ cohort: 1, track: 'BE', roles: ['메인테이너', '리드', '리뷰어'] }, { cohort: 2, track: 'BE', roles: ['메인테이너', '리드'] }] },

  // ── 1기 (2024-2) ──
  { id: 6, login: 'Songhyejeong', name: '송혜정', school: '세종대학교', department: ['지능기전공학부'], admissionYear: 21, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=FE', memberships: [{ cohort: 1, track: 'FE', roles: ['멤버'], team: '따라행' }, { cohort: 2, track: 'FE', roles: ['메인테이너', '리드', '리뷰어'] }, { cohort: 3, track: 'FE', roles: ['메인테이너', '리드', '리뷰어'] }, { cohort: 4, track: 'FE', roles: ['리뷰어'] }] },
  { id: 7, login: 'gogo1414', name: '김준수', school: '세종대학교', department: ['지능기전공학부'], admissionYear: 20, avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=BE', memberships: [{ cohort: 1, track: 'FE', roles: ['멤버'], team: '따라행' }, { cohort: 3, track: 'BE', roles: ['메인테이너', '리뷰어'] }] },
  { id: 8, login: 'c0mpuTurtle', name: '신혜빈', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 22, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 1, track: 'BE', roles: ['멤버'], team: '모꼬지' }, { cohort: 3, track: 'BE', roles: ['리드', '리뷰어'] }, { cohort: 4, track: 'BE', roles: ['메인테이너', '리뷰어'] }] },
  { id: 9, login: 'goldm0ng', name: '안금서', school: '세종대학교', department: ['소프트웨어학과'], admissionYear: 22, avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=BE', memberships: [{ cohort: 1, track: 'BE', roles: ['멤버'], team: '모꼬지' }, { cohort: 2, track: 'BE', roles: ['리드'] }, { cohort: 3, track: 'BE', roles: ['리드'] }] },
  { id: 10, login: 'SANGHEEJEONG', name: '정상희', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 23, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 1, track: 'BE', roles: ['멤버'], team: '따라행' }, { cohort: 2, track: 'BE', roles: ['리드'] }, { cohort: 3, track: 'BE', roles: ['리드', '리뷰어'] }, { cohort: 4, track: 'BE', roles: ['동아리장', '메인테이너', '리드'] }] },
  { id: 11, login: 'haeyoon1', name: '남해윤', school: '세종대학교', department: ['데이터사이언스학과'], admissionYear: 21, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 1, track: 'BE', roles: ['멤버'], team: '따라행' }, { cohort: 3, track: 'BE', roles: ['메인테이너', '리드', '리뷰어'] }, { cohort: 4, track: 'BE', roles: ['리뷰어'] }] },
  { id: 12, login: 'davidolleh', name: '황승준', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: null, avatarUrl: null, missionDashboardUrl: '/missions?cohort=1&track=BE', memberships: [{ cohort: 1, track: 'BE', roles: ['멤버'], team: '모꼬지' }] },
  {
    id: 13,
    login: 'developowl',
    name: '신지훈',
    school: '세종대학교',
    department: ['전자정보통신공학과'],
    admissionYear: 21,
    avatarUrl: null,
    missionDashboardUrl: '/missions?cohort=3&track=BE',
    memberships: [
      { cohort: 1, track: 'BE', roles: ['멤버'], team: '따라행' },
      { cohort: 2, track: 'FE', roles: ['멤버'], team: '슬종생' },
      { cohort: 3, track: 'BE', roles: ['메인테이너', '리뷰어'] },
    ],
    bio: '1기 BE → 2기 FE → 3기 BE. 트랙을 두 번 바꿔봤습니다.',
    // 비공개 프로필 케이스 — isPublic: false. 로그인 없이 조회해도 지금은 마스킹되지 않고 그대로 노출됨(§11-5 미결).
    isPublic: false,
    summaryCounts: { completedMissions: 3, teamProjects: 1, blogPosts: 0 },
    completedMissions: [
      { missionId: 'spring-security', title: 'Spring Security 인증 구현', cohortLabel: 'BE 3기', weekLabel: '6주차' },
      { missionId: 'react-hooks', title: '커스텀 훅으로 로직 분리', cohortLabel: 'FE 2기', weekLabel: '3주차' },
      { missionId: 'restapi-basic', title: 'REST API 기본 설계', cohortLabel: 'BE 1기', weekLabel: '2주차' },
    ],
    blogPosts: [],
    teamProjects: [{ projectId: 3, name: '슬종생', roleLabel: 'FE 담당' }],
    activities: [],
  },
  { id: 14, login: 'sansan20535', name: '김의진', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: null, avatarUrl: null, missionDashboardUrl: '/missions?cohort=1&track=BE', memberships: [{ cohort: 1, track: 'BE', roles: ['멤버'], team: '모꼬지' }] },

  // ── 2기 (2025-1) — 신지훈: 1기 BE(따라행) → 2기 FE(슬종생) 트랙 전환 ──
  { id: 15, login: 'zldn109', name: '신지우', school: '세종대학교', department: ['소프트웨어학과'], admissionYear: 22, avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=FE', memberships: [{ cohort: 2, track: 'FE', roles: ['멤버'], team: '슬종생' }, { cohort: 3, track: 'FE', roles: ['리드'] }] },
  { id: 16, login: 'ChangwooJ', name: '정창우', school: '세종대학교', department: ['전자정보통신공학과'], admissionYear: 20, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=FE', memberships: [{ cohort: 2, track: 'FE', roles: ['멤버'], team: '슬종생' }, { cohort: 4, track: 'FE', roles: ['메인테이너', '리드', '리뷰어'] }] },
  { id: 17, login: 'gxuoo', name: '임규영', school: '세종대학교', department: ['소프트웨어학과'], admissionYear: 20, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=FE', memberships: [{ cohort: 2, track: 'FE', roles: ['멤버'], team: '줍줍' }, { cohort: 3, track: 'FE', roles: ['리드'] }, { cohort: 4, track: 'FE', roles: ['리뷰어'] }] },
  {
    id: 18,
    login: 'mintcoke123',
    name: '강동현',
    school: '세종대학교',
    department: ['컴퓨터공학과'],
    admissionYear: 22,
    avatarUrl: null,
    missionDashboardUrl: '/missions?cohort=3&track=BE',
    memberships: [
      { cohort: 2, track: 'FE', roles: ['멤버'], team: '줍줍' },
      { cohort: 3, track: 'BE', roles: ['멤버'], team: '두구두구' },
    ],
    bio: '2기 FE로 시작해서 3기에 BE로 트랙을 바꿨습니다. 둘 다 해보니 서버 쪽이 더 재밌더라고요.',
    isPublic: true,
    // 기수마다 소속 팀이 달라 팀 프로젝트도 두 건 — memberships[]와 별개 배열이라 개수가 안 맞을 수 있음(§11-3 참고).
    summaryCounts: { completedMissions: 2, teamProjects: 2, blogPosts: 1 },
    completedMissions: [
      { missionId: 'spring-api-basic', title: '[3기] Spring 기본 API 구축', cohortLabel: 'BE 3기', weekLabel: '4주차' },
      { missionId: 'react-component', title: '컴포넌트 분리 연습', cohortLabel: 'FE 2기', weekLabel: '2주차' },
    ],
    blogPosts: [
      { postId: 4, title: 'FE에서 BE로, 트랙을 바꾸며 든 생각', category: '회고', relativeDate: '2주 전' },
    ],
    teamProjects: [
      { projectId: 2, name: '줍줍', roleLabel: 'FE 담당' },
      { projectId: 1, name: '두구두구', roleLabel: 'BE 담당' },
    ],
    activities: [
      { activityId: 4, date: '2026.05', tag: '데모데이', title: '3기 데모데이' },
    ],
  },
  { id: 19, login: 'INSANE-P', name: '박찬빈', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 21, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=FE', memberships: [{ cohort: 2, track: 'FE', roles: ['멤버'], team: '줍줍' }, { cohort: 3, track: 'FE', roles: ['리드'] }, { cohort: 4, track: 'FE', roles: ['메인테이너', '리드', '리뷰어'] }] },
  { id: 20, login: 'HyerimH', name: '황혜림', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 23, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 2, track: 'BE', roles: ['멤버'], team: '줍줍' }, { cohort: 4, track: 'BE', roles: ['메인테이너'] }] },
  { id: 21, login: 'gjtjrl303', name: '허석준', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 21, avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=BE', memberships: [{ cohort: 2, track: 'BE', roles: ['멤버'], team: '슬종생' }] },
  { id: 22, login: 'jeonseohee9', name: '전서희', school: '세종대학교', department: ['소프트웨어학과'], admissionYear: 23, avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=BE', memberships: [{ cohort: 2, track: 'BE', roles: ['멤버'], team: '줍줍' }] },
  { id: 23, login: 'chxghee', name: '이창희', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 20, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 2, track: 'BE', roles: ['멤버'], team: '줍줍' }, { cohort: 4, track: 'BE', roles: ['리뷰어'] }] },
  { id: 24, login: 'Ji-Woo-Kim', name: '김지우', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 21, avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=BE', memberships: [{ cohort: 2, track: 'BE', roles: ['멤버'], team: '슬종생' }] },
  { id: 25, login: 'JihwanYeom', name: '염지환', school: '세종대학교', department: ['소프트웨어학과'], admissionYear: 21, avatarUrl: null, missionDashboardUrl: '/missions?cohort=2&track=BE', memberships: [{ cohort: 2, track: 'BE', roles: ['멤버'], team: '슬종생' }] },

  // ── 3기 (2025-2) — 강동현: 2기 FE(줍줍) → 3기 BE(두구두구) 트랙 전환 ──
  {
    id: 26,
    login: 'yoonjaehong26',
    name: '윤재홍',
    school: '세종대학교',
    department: ['소프트웨어학과'],
    admissionYear: 23,
    avatarUrl: null,
    missionDashboardUrl: '/missions?cohort=4&track=FE',
    memberships: [{ cohort: 3, track: 'FE', roles: ['멤버'], team: '두구두구' }, { cohort: 4, track: 'FE', roles: ['메인테이너', '리드'] }],
    bio: '프론트엔드에 관심 많은 개발자. 그리디에서 미션·리뷰로 성장 중.',
    isPublic: true,
    summaryCounts: { completedMissions: 4, teamProjects: 1, blogPosts: 3 },
    completedMissions: [
      { missionId: 'routing-spa', title: '[3기] 라우팅 기반 SPA 구현', cohortLabel: 'FE 3기', weekLabel: '5주차' },
      { missionId: 'react-todo-optimize', title: 'TodoList 렌더링 최적화', cohortLabel: 'FE 3기', weekLabel: '4주차' },
      { missionId: 'zustand-state', title: 'Zustand로 전역 상태 리팩터링', cohortLabel: 'FE 3기', weekLabel: '3주차' },
      { missionId: 'jsx-basics', title: 'JSX & 컴포넌트 기초', cohortLabel: 'FE 3기', weekLabel: '1주차' },
    ],
    blogPosts: [
      { postId: 1, title: '상태관리 미션, Zustand로 다시 짜며 배운 것', category: '회고', relativeDate: '3일 전' },
      { postId: 2, title: '렌더링 최적화 삽질기', category: '기술', relativeDate: '3주 전' },
      { postId: 3, title: '첫 미션 PR, 리뷰 받고 느낀 것', category: '회고', relativeDate: '한 달 전' },
    ],
    teamProjects: [{ projectId: 1, name: '두구두구', roleLabel: 'FE 담당' }],
    activities: [
      { activityId: 1, date: '2026.05', tag: '행사', title: '3기 MT — 1박 2일' },
      { activityId: 2, date: '2026.04', tag: '세션', title: 'React 심화 세션' },
      { activityId: 3, date: '2026.03', tag: '행사', title: '3기 OT & 아이스브레이킹' },
    ],
  },
  { id: 27, login: 'johncakes', name: '심혁', school: '세종대학교', department: ['소프트웨어학과'], admissionYear: 21, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=FE', memberships: [{ cohort: 3, track: 'FE', roles: ['멤버'], team: '두구두구' }, { cohort: 4, track: 'FE', roles: ['메인테이너', '리드'] }] },
  { id: 28, login: 'dkr-sjr', name: '강건', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 22, avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=FE', memberships: [{ cohort: 3, track: 'FE', roles: ['멤버'], team: '밋링크' }] },
  { id: 29, login: 'ehlung', name: '강예령', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 21, avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=FE', memberships: [{ cohort: 3, track: 'FE', roles: ['멤버'], team: '밋링크' }] },
  { id: 30, login: 'ke-62', name: '이고은', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 23, avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=BE', memberships: [{ cohort: 3, track: 'BE', roles: ['멤버'], team: '두구두구' }] },
  { id: 31, login: 'chemistryx', name: '하수한', school: '세종대학교', department: ['소프트웨어학과'], admissionYear: 22, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 3, track: 'BE', roles: ['멤버'], team: '밋링크' }, { cohort: 4, track: 'BE', roles: ['리뷰어'] }] },
  { id: 32, login: 'tae-wooo', name: '김태우', school: '세종대학교', department: ['소프트웨어학과'], admissionYear: 22, avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=BE', memberships: [{ cohort: 3, track: 'BE', roles: ['멤버'], team: '두구두구' }] },
  { id: 33, login: 'nonactress', name: '서현진', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 22, avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=BE', memberships: [{ cohort: 3, track: 'BE', roles: ['멤버'], team: '밋링크' }] },
  { id: 34, login: 'kimsky247-coder', name: '김하늘', school: '세종대학교', department: ['전자정보통신공학과'], admissionYear: 24, avatarUrl: null, missionDashboardUrl: '/missions?cohort=3&track=BE', memberships: [{ cohort: 3, track: 'BE', roles: ['멤버'], team: '밋링크' }] },

  // ── 영입리드(4기 합류, 실질 역할은 메인테이너·리뷰어) ──
  { id: 35, login: 'supernovaMK', name: '김민기', school: '세종대학교', department: ['소프트웨어학과'], admissionYear: 21, joinType: '영입리드', avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 4, track: 'BE', roles: ['메인테이너', '리뷰어'] }] },
  { id: 36, login: '2Jin1031', name: '이진', school: '세종대학교', department: ['양자원자력공학과', '컴퓨터공학과'], admissionYear: 22, joinType: '영입리드', avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 4, track: 'BE', roles: ['메인테이너', '리뷰어'] }] },

  // ── 4기 (2026-1, 진행 중 — 데모데이팀 노션 미기재) ──
  { id: 37, login: 'EM-H20', name: '홍의민', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 20, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=FE', memberships: [{ cohort: 4, track: 'FE', roles: ['멤버'] }] },
  { id: 38, login: 'rahwan10', name: '김동건', school: '세종대학교', department: ['지능기전공학부'], admissionYear: 22, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=FE', memberships: [{ cohort: 4, track: 'FE', roles: ['멤버'] }] },
  { id: 39, login: 'kokunut', name: '고규민', school: '세종대학교', department: ['지능기전공학부'], admissionYear: 22, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=FE', memberships: [{ cohort: 4, track: 'FE', roles: ['멤버'] }] },
  { id: 40, login: 'realcdh', name: '천동현', school: '세종대학교', department: ['지능기전공학부'], admissionYear: 22, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=FE', memberships: [{ cohort: 4, track: 'FE', roles: ['멤버'] }] },
  // 이태규: 4기 미션 포기(중도 하차) — 참고용, 별도 상태 필드는 아직 없음
  { id: 41, login: 'hapdaypy', name: '김민욱', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 22, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 4, track: 'BE', roles: ['멤버'] }] },
  { id: 42, login: 'Kdahyn', name: '강대현', school: '세종대학교', department: ['지능기전공학부'], admissionYear: 22, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 4, track: 'BE', roles: ['멤버'] }] },
  { id: 43, login: 'htdufhc-bit', name: '정명준', school: '세종대학교', department: ['컴퓨터공학과'], admissionYear: 22, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 4, track: 'BE', roles: ['멤버'] }] },
  { id: 44, login: 'chaehyunL', name: '이채현', school: '세종대학교', department: ['Ai로봇학과'], admissionYear: 24, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 4, track: 'BE', roles: ['멤버'] }] },
  { id: 45, login: 'haeun92e0', name: '김하은', school: '세종대학교', department: ['영어영문학과', '컴퓨터공학과'], admissionYear: 22, avatarUrl: null, missionDashboardUrl: '/missions?cohort=4&track=BE', memberships: [{ cohort: 4, track: 'BE', roles: ['멤버'] }] },
  // 4기 미션 포기(중도 하차) — 완료 미션 없이도 프로필은 정상 노출되는 케이스, 별도 상태 필드는 아직 없음
  {
    id: 46,
    login: 'Cappucciyes',
    name: '이태규',
    school: '세종대학교',
    department: ['컴퓨터공학과'],
    admissionYear: 20,
    avatarUrl: null,
    missionDashboardUrl: '/missions?cohort=4&track=BE',
    memberships: [{ cohort: 4, track: 'BE', roles: ['멤버'] }],
    bio: '개인 사정으로 4기 미션은 중도에 그만뒀습니다.',
    isPublic: true,
    summaryCounts: { completedMissions: 0, teamProjects: 0, blogPosts: 0 },
    completedMissions: [],
    blogPosts: [],
    teamProjects: [],
    activities: [
      { activityId: 6, date: '2026.03', tag: '행사', title: '4기 OT & 아이스브레이킹' },
    ],
  },
];
