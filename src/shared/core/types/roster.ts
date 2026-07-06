/**
 * 미션 대시보드 명부·카탈로그 도메인 타입.
 * 노션 정리본(데모데이·기념비·혜빈님 정리본 3중 교차검증)을 코드로 하드하게 옮긴 것.
 * 실제 PR 데이터(Mission)는 sync가 채우고, 여기 정의는 "누가 어느 기수·트랙인지"의 정답표.
 */

export type Track = 'FE' | 'BE';
export type CohortId = 1 | 2 | 3 | 4;

/** 스터디원(F/B)만 미션 참여 대상. 나머지 역할의 미션레포 PR = 제외 후보(노이즈). */
export type MemberRole = 'F' | 'B' | 'FL' | 'FR' | 'BL' | 'BR' | 'M' | 'L';

export interface Cohort {
  id: CohortId;
  label: string;      // "3기"
  semester: string;   // "2025-2"
  /** PR 귀속 날짜창 시작 (ISO). cross-cohort 멤버를 기수별로 가르는 기준. */
  startDate: string;
  /** PR 귀속 날짜창 끝 (ISO). */
  endDate: string;
  ongoing: boolean;   // 진행 중이면 미머지가 자연스러움
}

export interface Membership {
  cohort: CohortId;
  track: Track;
  role: MemberRole;
  team?: string;      // "두구두구" · "밋링크"
}

export interface Member {
  /** GitHub login (표시용 원본 대소문자. 매칭은 소문자로 정규화). */
  login: string;
  name: string;
  withdrawn?: boolean;   // 동아리 탈퇴
  abandoned?: boolean;   // 미션 포기(중도 하차) — 남은 미션 미완이 예상됨
  memberships: Membership[];
  /** QA용 사전 메모 (예: 이름 확정, 대소문자 주의). */
  note?: string;
}

/** 미션 안의 단계/페이즈 하나 (예: 로또 '3단계', 방탈출 'JPA(4-6)'). PR 하나가 여러 유닛을 커버할 수 있음. */
export interface MissionUnit {
  id: string;      // 매칭 키 ('3' | 'jpa' | 'w1' …)
  label: string;   // 표시 라벨
}

/** 기수·트랙별 미션 1개 = 레포 1개. 완주 판정은 레포가 아니라 units(단계) 커버리지로. */
export interface CatalogMission {
  cohort: CohortId;
  track: Track;
  order: number;         // 표시 순서 (0-based)
  label: string;         // "React 심화"
  repository: string;    // "org/repo"
  units: MissionUnit[];  // 이 미션의 단계/페이즈 목록 (완주 = 전 units 머지)
  introUrl?: string;     // 미션 소개 README 링크 (goal 1)
  /** BE 상세 소개 보류 등, 참고 표시용. */
  note?: string;
}

/** 자동 집계를 수동 교정하는 오버라이드 (테스트/오작성 PR 제외, 기수·트랙 재지정 등). */
export interface PROverride {
  missionId: string;                 // `${repository}#${prNumber}`
  status: 'include' | 'exclude';
  reassignCohort?: CohortId;
  reassignRepository?: string;       // 카탈로그 다른 셀로 이동
  note?: string;
}
