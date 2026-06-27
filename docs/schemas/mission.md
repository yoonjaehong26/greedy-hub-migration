# Schema: missions + missionSubmissions

미션 **템플릿**(`missions`)과 멤버별 **제출 기록**(`missionSubmissions`)을 분리한다.

## TypeScript Interface

```typescript
import { ObjectId } from 'mongodb';

// ── missions 컬렉션 — 운영진이 출제하는 미션 정의 ──────────────────────────────
export interface MissionDocument {
  _id: ObjectId;
  slug: string;                     // 'adv-2.1' — URL·식별자 (트랙+기수 내 고유)
  title: string;                    // '[adv-2.1] 상태관리 심화 — Zustand'
  description: string;              // 미션 개요 (마크다운)
  track: 'FE' | 'BE';
  generation: number;               // 대상 기수
  week: number;                     // 주차 번호
  weekLabel: string;                // '6주차' (표시용)
  githubRepo: string | null;        // 연결 GitHub 레포 slug
  requirements: MissionRequirement[]; // 요구사항 체크리스트 (멤버 화면에 표시)
  reviewGuideline: string;          // 리뷰 포인트 (마크다운, 리뷰어만 조회)
  reviewPeriodDays: number;         // 기본 리뷰 기간(일)
  isSkipWeek: boolean;              // 중간고사 등 쉬는 주
  status: MissionStatus;
  createdBy: ObjectId;              // staff members._id
  createdAt: Date;
  updatedAt: Date;
}

export type MissionStatus = 'DRAFT' | 'OPEN' | 'CLOSED';

export interface MissionRequirement {
  text: string;
  order: number; // 정렬 순서
}

// ── missionSubmissions 컬렉션 — 멤버별 제출·리뷰 기록 ────────────────────────
export interface MissionSubmissionDocument {
  _id: ObjectId;
  missionId: ObjectId;              // missions._id
  memberId: ObjectId;               // 제출 멤버 members._id
  reviewerId: ObjectId | null;      // 배정된 리뷰어 members._id
  prNumber: number | null;          // GitHub PR 번호
  prUrl: string | null;             // GitHub PR URL
  reviewRound: number;              // 리뷰 라운드 수 (1R, 2R …)
  status: SubmissionStatus;
  deadline: Date | null;            // 이번 리뷰 라운드 마감일
  reflectedAt: Date | null;         // 멤버가 "리뷰 반영 완료" 누른 시각
  mergedAt: Date | null;            // 머지(완료) 처리 시각
  submittedAt: Date;
  updatedAt: Date;
}

export type SubmissionStatus =
  | 'submitted'  // PR 제출됨, 리뷰어 미배정
  | 'in_review'  // 리뷰어 배정 후 리뷰 진행 중
  | 'merged'     // 기간 종료 → 완료
  | 'skipped';   // 쉬는 주

// ── 앱용 변환형 ─────────────────────────────────────────────────────────────
export interface Mission extends Omit<MissionDocument, '_id' | 'createdAt' | 'updatedAt'> {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface MissionSubmission extends Omit<MissionSubmissionDocument, '_id' | 'submittedAt' | 'updatedAt'> {
  id: string;
  submittedAt: string;
  updatedAt: string;
}

// 미션 목록 뷰 — 멤버 화면에서 "내 미션"을 렌더링할 때 사용
export interface MissionWithSubmission extends Mission {
  submission: MissionSubmission | null; // 해당 멤버의 제출 기록
}
```

## 컬렉션 간 관계

| 참조 방향 | 의미 |
|---|---|
| `missionSubmissions.missionId` → `missions._id` | 어느 미션의 제출인지 |
| `missionSubmissions.memberId` → `members._id` | 제출자 |
| `missionSubmissions.reviewerId` → `members._id` | 배정 리뷰어 |
| `missions.createdBy` → `members._id` | 출제 운영진 |
| `studies.linkedMissionId` → `missions._id` | 스터디 주차와 연결 |

## 인덱스 권장

```js
// missions — 기수·트랙·주차 단위 조회 (+ 고유 제약)
db.missions.createIndex({ generation: 1, track: 1, week: 1 }, { unique: true });
db.missions.createIndex({ slug: 1, generation: 1 }, { unique: true });
db.missions.createIndex({ status: 1 });

// missionSubmissions — 멤버별 내 미션 목록
db.missionSubmissions.createIndex({ memberId: 1, status: 1 });

// 리뷰어별 배정 현황
db.missionSubmissions.createIndex({ reviewerId: 1, status: 1 });

// 특정 미션의 전체 제출 목록 (운영진 매트릭스)
db.missionSubmissions.createIndex({ missionId: 1 });

// 멤버×미션 중복 방지
db.missionSubmissions.createIndex(
  { missionId: 1, memberId: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'skipped' } } }
);
```

## 설계 메모

- `missions`는 "템플릿" — 기수가 바뀌어도 같은 커리큘럼이면 재사용 가능.  
  `generation`으로 기수를 구분하므로 같은 미션을 다음 기수에 복사해 출제 가능.
- `reviewGuideline`은 리뷰어 전용 필드. API에서 `멤버` 역할 응답 시 제외.
- `deadline`은 제출 시점 기준으로 `reviewPeriodDays`를 더해 계산 후 저장.
- `isSkipWeek: true`인 미션은 `missionSubmissions`에 `status: 'skipped'` 문서로 자동 생성.
