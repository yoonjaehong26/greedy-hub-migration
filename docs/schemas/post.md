# Schema: posts (기술블로그)

## TypeScript Interface

```typescript
import { ObjectId } from 'mongodb';

// ── DB 문서형 ────────────────────────────────────────────────────────────────
export interface PostDocument {
  _id: ObjectId;
  title: string;
  body: string;                    // 마크다운 본문
  category: PostCategory;          // 대분류 태그
  tags: string[];                  // 세부 태그 (예: ['React', 'Zustand'])
  authorId: ObjectId;              // members._id
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: Date | null;        // 발행 시각 (목록 정렬 기준)
  comments: PostComment[];         // 임베디드 1-depth 댓글
  createdAt: Date;
  updatedAt: Date;
}

export type PostCategory = '회고' | '기술' | '취업' | '트러블슈팅';

export interface PostComment {
  _id: ObjectId;
  authorId: ObjectId;              // members._id
  body: string;
  createdAt: Date;
}

// ── 앱용 변환형 ─────────────────────────────────────────────────────────────
export interface Post extends Omit<PostDocument, '_id' | 'createdAt' | 'updatedAt' | 'publishedAt'> {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// 목록 카드용 경량 타입 (body 제외)
export interface PostSummary extends Omit<Post, 'body' | 'comments'> {
  commentCount: number;
  authorName: string;          // 조인 결과 (API 레이어에서 채움)
  authorTrack: string;
  authorGeneration: number;
}
```

## 컬렉션 간 관계

| 참조 방향 | 의미 |
|---|---|
| `posts.authorId` → `members._id` | 작성자 |
| `posts.comments[].authorId` → `members._id` | 댓글 작성자 |

멤버 프로필에 "기술글 목록"을 표시할 때:
→ `posts` 컬렉션에서 `{ authorId, status: 'PUBLISHED' }`로 조회.

## 인덱스 권장

```js
// 공개 블로그 목록 — 최신순
db.posts.createIndex({ status: 1, publishedAt: -1 });

// 카테고리 필터
db.posts.createIndex({ category: 1, status: 1, publishedAt: -1 });

// 태그 필터 (multikey)
db.posts.createIndex({ tags: 1, status: 1 });

// 작성자 프로필 연동 (내 글 목록)
db.posts.createIndex({ authorId: 1, status: 1, publishedAt: -1 });
```

## 설계 메모

- 댓글은 1-depth만 지원 — 임베디드 배열로 관리 (볼륨 예측 가능).  
  댓글이 많아질 경우 별도 `postComments` 컬렉션 분리 검토.
- `body`는 마크다운 원본을 저장. 렌더링은 클라이언트에서.
- `DRAFT` 상태의 글은 `authorId`가 본인인 경우에만 조회 허용.
- 발행 시 `publishedAt`을 현재 시각으로, `status`를 `'PUBLISHED'`로 동시 업데이트.
- 이미지는 CDN URL로 본문 마크다운에 포함 — 별도 필드 없음.
