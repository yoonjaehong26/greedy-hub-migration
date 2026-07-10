/**
 * externalReviewers.ts — 외부 리뷰어 목 데이터
 *
 * 출처: 노션 "그리디 멤버 최종 정리(혜빈님 정리본)" 페이지 하위 "외부 리뷰어" DB(10명).
 * 그리디 동아리원이 아니라 기수·트랙별 PR 리뷰만 담당하는 비회원 — `members.ts`(그리디 전체 46명)와는
 * 별개 인물군이라 분리했다. 백엔드 API 스코프에서도 명시적으로 제외돼 있다(backend-api-spec.md §3) —
 * 이 파일은 아직 어떤 MSW 핸들러·엔드포인트에도 연결되지 않은 순수 참고용 데이터다. 필요해지면
 * `/api/external-reviewers` 같은 별도 엔드포인트를 설계할 것.
 */

export type Track = 'FE' | 'BE';

export interface ExternalReviewerAssignment {
  cohort: number;
  track: Track;
}

export interface ExternalReviewer {
  id: number;
  login: string;
  name: string;
  /** 리뷰를 맡은 기수·트랙 목록(리드/메인테이너 등 다른 역할은 없음 — 리뷰 전담). */
  assignments: ExternalReviewerAssignment[];
}

export const EXTERNAL_REVIEWERS: ExternalReviewer[] = [
  { id: 1, login: 'wzrabbit', name: '김의천(요술토끼)', assignments: [{ cohort: 1, track: 'FE' }, { cohort: 2, track: 'FE' }, { cohort: 3, track: 'FE' }, { cohort: 4, track: 'FE' }] },
  { id: 2, login: 'be-student', name: '송은우(누누)', assignments: [{ cohort: 1, track: 'BE' }, { cohort: 2, track: 'BE' }] },
  { id: 3, login: 'dooboocookie', name: '백경환(루카)', assignments: [{ cohort: 1, track: 'BE' }, { cohort: 2, track: 'BE' }, { cohort: 3, track: 'BE' }] },
  { id: 4, login: '70825', name: '정다빈', assignments: [{ cohort: 1, track: 'BE' }, { cohort: 2, track: 'BE' }, { cohort: 3, track: 'BE' }, { cohort: 4, track: 'BE' }] },
  { id: 5, login: 'BackFoxx', name: '조승현(여우)', assignments: [{ cohort: 1, track: 'BE' }, { cohort: 2, track: 'BE' }] },
  { id: 6, login: 'shin-mallang', name: '신동훈', assignments: [{ cohort: 2, track: 'BE' }] },
  { id: 7, login: 'HyeryongChoi', name: '최혜령', assignments: [{ cohort: 3, track: 'FE' }] },
  { id: 8, login: 'suyoungj', name: '정수영', assignments: [{ cohort: 3, track: 'FE' }] },
  { id: 9, login: 'shackstack', name: '김민석', assignments: [{ cohort: 3, track: 'FE' }] },
  { id: 10, login: 'sangjun121', name: '조상준', assignments: [{ cohort: 4, track: 'BE' }] },
];
