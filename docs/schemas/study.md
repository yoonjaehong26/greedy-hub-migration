# Schema: studies (커리큘럼)

## TypeScript Interface

```typescript
import { ObjectId } from 'mongodb';

// ── DB 문서형 ────────────────────────────────────────────────────────────────
export interface StudyDocument {
  _id: ObjectId;
  track: 'FE' | 'BE';
  generation: number;               // 기수
  week: number;                     // 주차 번호 (정렬 기준)
  weekLabel: string;                // '1주차' (표시용)
  title: string;                    // 'JSX & 컴포넌트 기초'
  status: StudyStatus;
  isSkipWeek: boolean;              // 쉬는 주 (중간고사·공휴일)
  studyNoteUrl: string | null;      // 대면 스터디 핵심 노트 URL (내부)
  externalUrl: string | null;       // 노션 자료 등 외부 링크
  linkedMissionId: ObjectId | null; // missions._id — 이 주차 연결 미션
  createdAt: Date;
  updatedAt: Date;
}

export type StudyStatus = 'upcoming' | 'in_progress' | 'done' | 'skipped';

// ── 앱용 변환형 ─────────────────────────────────────────────────────────────
export interface Study extends Omit<StudyDocument, '_id' | 'createdAt' | 'updatedAt'> {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// 커리큘럼 목록 렌더링용 (linkedMission 조인 포함)
export interface StudyWithMission extends Study {
  linkedMission: {
    id: string;
    slug: string;
    title: string;
    status: import('./mission').MissionStatus;
  } | null;
}
```

## 컬렉션 간 관계

| 참조 방향 | 의미 |
|---|---|
| `studies.linkedMissionId` → `missions._id` | 이 주차에 연결된 미션 |

## 인덱스 권장

```js
// 기수·트랙 커리큘럼 조회 (주차순) — 고유 제약
db.studies.createIndex(
  { generation: 1, track: 1, week: 1 },
  { unique: true }
);

// 상태 필터
db.studies.createIndex({ generation: 1, track: 1, status: 1 });
```

## 설계 메모

- `isSkipWeek: true`이면 `studyNoteUrl`·`externalUrl`·`linkedMissionId`는 null.
- `status`는 현재 날짜와 미션 상태를 기반으로 운영진이 수동 또는  
  배치 작업(cron)으로 갱신한다. 계산은 애플리케이션 레이어 책임.
- 같은 커리큘럼을 다음 기수에 재사용할 때는 `generation`만 바꿔 복사.
- `studyNoteUrl`은 그리디 허브 내부 링크, `externalUrl`은 노션 등 외부 링크.  
  두 필드를 분리해 UI에서 아이콘을 다르게 표시 가능.
