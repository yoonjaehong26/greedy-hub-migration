# Schema: applications (지원)

## TypeScript Interface

```typescript
import { ObjectId } from 'mongodb';

// ── DB 문서형 ────────────────────────────────────────────────────────────────
export interface ApplicationDocument {
  _id: ObjectId;
  generation: number;              // 지원 기수 (4, 5 …)
  name: string;                    // 지원자 이름
  major: string;                   // 학과
  studentId: string;               // 학번
  track: 'FE' | 'BE';             // 희망 트랙
  email: string;                   // 결과 안내용 — PI
  discordId: string | null;        // 선택 입력 — PI
  githubUrl: string | null;        // 선택 입력
  motivation: string;              // 지원 동기
  stage: ApplicationStage;         // 심사 단계 (운영진 내부)
  privacyConsent: boolean;         // 개인정보 수집·이용 동의
  submittedAt: Date;
  updatedAt: Date;
}

export type ApplicationStage = '서류' | '면접' | '합격' | '불합격';

// ── 앱용 변환형 ─────────────────────────────────────────────────────────────
export interface Application extends Omit<ApplicationDocument, '_id' | 'submittedAt' | 'updatedAt'> {
  id: string;
  submittedAt: string;
  updatedAt: string;
}

// 운영진 목록용 경량 타입 (motivation 제외)
export interface ApplicationSummary {
  id: string;
  generation: number;
  name: string;
  major: string;
  studentId: string;
  track: Application['track'];
  email: string;
  discordId: string | null;
  stage: ApplicationStage;
  submittedAt: string;
}
```

## 컬렉션 간 관계

`applications`는 독립 컬렉션. 외부 FK 없음.

합격 처리 흐름:
```
applications.stage = '합격'
  → API 로직에서 members 컬렉션에 신규 문서 삽입
  → (선택) applications 문서에 memberId 필드 추가로 역참조 보관
```

| 참조 방향 | 의미 |
|---|---|
| `applications.memberId?` → `members._id` | 합격 후 멤버 전환 시 연결 (선택) |

## 인덱스 권장

```js
// 기수별 단계 조회 (운영진 관리 화면)
db.applications.createIndex({ generation: 1, stage: 1 });

// 트랙 필터
db.applications.createIndex({ generation: 1, track: 1 });

// 접수일순
db.applications.createIndex({ submittedAt: -1 });
```

## 설계 메모

- 지원자에게 사이트에서 실시간 단계 조회를 제공하지 않음.  
  `stage` 변경은 운영진 내부 기록이며, 결과 통보는 이메일/디스코드 직접 진행.
- `email`·`discordId`·`studentId`는 PI — 전체 응답은 운영진 역할만 허용.
- 중복 지원 방지: 동일 `generation` + `studentId` 조합에 unique 제약 추가 검토.  
  ```js
  db.applications.createIndex(
    { generation: 1, studentId: 1 },
    { unique: true }
  );
  ```
- `privacyConsent: false`인 문서는 저장하지 않음 — 제출 API에서 검증.
