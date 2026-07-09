# Schema: projects (팀 프로젝트 아카이브)

## TypeScript Interface

```typescript
import { ObjectId } from 'mongodb';

// ── DB 문서형 ────────────────────────────────────────────────────────────────
export interface ProjectDocument {
  _id: ObjectId;
  name: string;                       // '모꼬지'
  description: string;                // '세종대학교의 여러 동아리를 한곳에서 잇는 통합 플랫폼'
  generation: number;                 // 기수 (4, 3 … 또는 0 = 기수 무관)
  generationLabel: string;            // '4기 · 공통' (표시용)
  track: 'FE' | 'BE' | 'COMMON';     // COMMON = FE+BE 혼합팀
  teamMembers: ProjectMember[];       // 팀원 목록
  techStack: string[];                // ['Next.js', 'Spring Boot', 'PostgreSQL']
  githubUrl: string | null;           // GitHub 저장소 URL
  liveUrl: string | null;             // 배포된 서비스 URL
  coverPhotoUrl: string | null;       // 카드·헤더 대표 이미지
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  memberId: ObjectId;                 // members._id
  role: 'FE' | 'BE';                 // 이 프로젝트에서의 역할
}

// ── 앱용 변환형 ─────────────────────────────────────────────────────────────
export interface Project extends Omit<ProjectDocument, '_id' | 'createdAt' | 'updatedAt'> {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// 목록 카드용 경량 타입
export interface ProjectSummary {
  id: string;
  name: string;
  generationLabel: string;
  description: string;
  track: ProjectDocument['track'];
  teamCount: number;                  // teamMembers.length
  coverPhotoUrl: string | null;
}

// 상세 조회 시 teamMembers 조인 포함
export interface ProjectWithMembers extends Project {
  teamMembers: (ProjectMember & {
    memberName: string;
    memberUsername: string;
  })[];
}
```

## 컬렉션 간 관계

| 참조 방향 | 의미 |
|---|---|
| `projects.teamMembers[].memberId` → `members._id` | 팀원 |

멤버 프로필의 "팀 프로젝트" 섹션:
→ `projects` 컬렉션에서 `{ 'teamMembers.memberId': memberId }`로 역조회.

## 인덱스 권장

```js
// 기수·트랙 필터 (목록 화면)
db.projects.createIndex({ generation: -1, track: 1 });

// 멤버 프로필 역조회 (multikey)
db.projects.createIndex({ 'teamMembers.memberId': 1 });
```

## 설계 메모

- `track: 'COMMON'`은 FE+BE 혼합팀을 의미 (예: "4기 · 공통").
  개별 팀원의 역할은 `ProjectMember.role`로 구분.
- `generation: 0`은 기수를 특정할 수 없는 경우 (예: 축제 부스 프로젝트).
  `generationLabel`로 표시 문자열을 별도 관리.
- 프로젝트 등록·편집은 운영진(`staff`)만 가능.
  팀원 역참조(멤버 프로필 연동)는 `projects` 인덱스 조회로 처리 — 별도 필드 불필요.
