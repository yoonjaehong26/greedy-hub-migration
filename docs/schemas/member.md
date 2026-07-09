# Schema: members

## TypeScript Interface

```typescript
import { ObjectId } from 'mongodb';

// ── DB 문서형 ────────────────────────────────────────────────────────────────
export interface MemberDocument {
  _id: ObjectId;
  username: string;                // @handle — URL slug, 고유 식별자
  name: string;                    // 실명
  track: 'FE' | 'BE' | 'COMMON';
  generation: number;              // 기수 (4, 3, 2 …)
  roles: MemberRole[];             // 기수 내 역할 (다중 부여 가능)
  bio: string;                     // 한 줄 소개 — 마크다운 허용
  isPublic: boolean;               // false면 비로그인 외부에 프로필 미노출
  avatarUrl: string | null;        // 프로필 이미지 URL
  university: string;              // 소속 대학 (기본 '세종대학교')
  major: string | null;            // 전공
  email: string;                   // 연락처 — 비공개, 심사·알림용
  githubUsername: string | null;
  discordId: string | null;
  permissions: MemberPermission[]; // 역할 기본값 위에 개별 오버라이드
  createdAt: Date;
  updatedAt: Date;
}

export type MemberRole = '멤버' | '리뷰어' | '리드' | '메인테이너' | 'OB';

export interface MemberPermission {
  key: string;      // 'mission:create' | 'mission:review' | 'recruit:review' 등
  label: string;    // UI 표시용 한국어 레이블
  granted: boolean;
}

// ── 앱용 변환형 (JSON 직렬화 후) ─────────────────────────────────────────────
export interface Member extends Omit<MemberDocument, '_id' | 'email' | 'createdAt' | 'updatedAt'> {
  id: string;
  createdAt: string; // ISO-8601
  updatedAt: string;
  // email은 본인·운영진만 조회 가능 — API 레이어에서 제거
}

// 멤버 목록 카드용 경량 타입
export interface MemberSummary {
  id: string;
  username: string;
  name: string;
  track: MemberDocument['track'];
  generation: number;
  roles: MemberRole[];
  avatarUrl: string | null;
  isPublic: boolean;
}
```

## 컬렉션 간 관계

| 참조 방향 | 필드 |
|---|---|
| `missionSubmissions.memberId` → `members._id` | 제출자 |
| `missionSubmissions.reviewerId` → `members._id` | 배정 리뷰어 |
| `missions.createdBy` → `members._id` | 미션 출제자 |
| `posts.authorId` → `members._id` | 블로그 작성자 |
| `posts.comments[].authorId` → `members._id` | 댓글 작성자 |
| `activities.mentionedMemberIds[]` → `members._id` | 참여 멤버 멘션 |
| `activities.createdBy` → `members._id` | 활동 등록자 |

## 인덱스 권장

```js
// 멤버 URL 조회
db.members.createIndex({ username: 1 }, { unique: true });

// 멤버 목록 필터 (기수 × 트랙)
db.members.createIndex({ generation: 1, track: 1 });

// 역할별 조회 (multikey)
db.members.createIndex({ roles: 1 });

// 운영진 권한 조회
db.members.createIndex({ 'permissions.key': 1 });
```

## 설계 메모

- `roles`는 기수(generation)별로 바뀔 수 있으므로 멤버 문서 안에 배열로 보관.  
  기수가 달라지면 새 문서를 추가하거나, `generationRoles: { [gen: number]: MemberRole[] }` 형태로 확장 검토.
- `permissions`는 역할 기본값(애플리케이션 코드에서 관리) 위에 개인 예외만 저장.  
  빈 배열 = 역할 기본값 그대로.
- `email`·`discordId`는 PI(개인정보) — API 응답에서 본인·운영진 외 제거.
