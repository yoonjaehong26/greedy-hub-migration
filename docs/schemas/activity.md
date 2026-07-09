# Schema: activities (활동 타임라인)

## TypeScript Interface

```typescript
import { ObjectId } from 'mongodb';

// ── DB 문서형 ────────────────────────────────────────────────────────────────
export interface ActivityDocument {
  _id: ObjectId;
  title: string;                         // '4기 MT — 1박 2일'
  date: string;                          // 'YYYY-MM' — 월 단위 정밀도
  category: ActivityCategory;
  description: string;                   // 마크다운 본문
  coverPhotoUrl: string | null;          // 대표 사진 URL (운영진 지정)
  photos: ActivityPhoto[];               // 활동 사진 목록
  mentionedMemberIds: ObjectId[];        // 참여 멤버 — 프로필에 자동 연결
  createdBy: ObjectId;                   // 최초 등록한 members._id
  createdAt: Date;
  updatedAt: Date;
}

export type ActivityCategory =
  | '행사'
  | '세션'
  | '데모데이'
  | '축제'
  | 'MT'
  | '창립';

export interface ActivityPhoto {
  _id: ObjectId;
  url: string;
  uploadedBy: ObjectId;                  // members._id
  uploadedAt: Date;
}

// ── 앱용 변환형 ─────────────────────────────────────────────────────────────
export interface Activity extends Omit<ActivityDocument, '_id' | 'createdAt' | 'updatedAt'> {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// 타임라인 카드용 경량 타입 (description·photos 제외)
export interface ActivitySummary {
  id: string;
  title: string;
  date: string;
  category: ActivityCategory;
  coverPhotoUrl: string | null;
  previewPhotos: string[];               // 최대 3장 URL (타임라인 썸네일)
  mentionedCount: number;
}
```

## 컬렉션 간 관계

| 참조 방향 | 의미 |
|---|---|
| `activities.createdBy` → `members._id` | 활동 최초 등록자 |
| `activities.mentionedMemberIds[]` → `members._id` | 참여 멤버 멘션 |
| `activities.photos[].uploadedBy` → `members._id` | 사진 업로더 |

멤버 프로필의 "참여한 활동" 섹션:
→ `activities` 컬렉션에서 `{ mentionedMemberIds: memberId }`로 조회.

## 인덱스 권장

```js
// 타임라인 — 최신순
db.activities.createIndex({ date: -1 });

// 카테고리 필터
db.activities.createIndex({ category: 1, date: -1 });

// 멤버 프로필 연동 (multikey)
db.activities.createIndex({ mentionedMemberIds: 1 });
```

## 설계 메모

- `date`는 `'YYYY-MM'` 문자열로 저장 — 일(day) 불명확한 경우가 많고,  
  타임라인 정렬이 월 단위이므로 `Date`보다 명시적.
- 사진 추가는 멤버 누구나 가능. `coverPhotoUrl` 변경·사진 삭제는 운영진만.
- 멘션된 멤버는 활동 등록 시 명시(`mentionedMemberIds`)하거나 이후 편집으로 추가.  
  자동 역방향 조회(멤버 프로필 → 참여 활동)는 인덱스로 처리.
