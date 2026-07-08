# 백엔드 API 명세 — MVP (멤버·프로젝트·스터디·활동 타임라인)

> Spring Boot + MySQL + Docker로 신규 구현할 백엔드의 계약 문서.
> 이 계약은 이미 `src/mocks/`의 MSW 목서버로 프론트에서 실제로 검증됨 — 목서버 핸들러가 곧 이 명세의 레퍼런스 구현.
> **MVP 범위**: 홈 통계·멤버·스터디·프로젝트·활동 타임라인. 블로그·지원(recruit)·미션리뷰는 이후 단계(제외).
> **로그인 없음** — 전부 공개 조회(GET). 쓰기(활동 올리기·프로필 편집)는 인증이 전제라 Phase 2.

## 1. 어디에 백엔드가 필요한가

미션 대시보드(`/missions`)·쇼케이스(`/showcase`)는 이미 별도 Next+MongoDB 백엔드가 붙어 있어 이 범위 밖. 나머지 5개 화면만 대상:

| 화면 | GET | 쓰기 | 갱신 주기 | 갱신 방식 |
|---|---|---|---|---|
| 활동 타임라인 (`/gallery`) | ✅ | ✅ (Phase 2) | 2~4주 | 실제 업로드 API |
| 멤버 (`/members`) | ✅ | ❌ | 반년(기수) | 학기 전환 시 SQL 시드 |
| 스터디 (`/study`) | ✅ | ❌ | 반년(기수) | 〃 |
| 프로젝트 (`/projects`) | ✅ | ❌ | 반년(데모데이) | 〃 |
| 홈 통계 (`/`) | ✅ | — | 실시간 집계 | 위 테이블 COUNT |

DB에 있는 데이터는 갱신 빈도와 무관하게 GET API가 있어야 프론트가 읽을 수 있다(브라우저는 MySQL에 직접 접속 불가). 쓰기 API·관리자 CRUD는 실제로 콘텐츠가 계속 쌓이는 **활동 타임라인 한 곳으로만 한정**한다.

## 2. 공통 규약

- Base URL: `/api/v1`
- 응답: JSON, `camelCase`. 목록은 `{ "items": [...] }`, 상세는 단일 객체.
- 필터는 쿼리 파라미터(`?track=FE`, `?category=행사` 등). MVP 규모(멤버 ~50, 프로젝트 십수 개)라 페이지네이션 불필요.
- 에러: `{ "error": { "code": "NOT_FOUND", "message": "..." } }` + 4xx/5xx status.
- 이미지 필드는 항상 완성된 URL 문자열(`thumbnailUrl`, `coverImageUrl`, `images[].url`). 저장 방식(Vercel Blob·S3 등)은 이후 결정, 프론트는 URL만 소비.

## 3. 멤버 (Members)

- `GET /members?track=FE|BE&cohort=4`
- `GET /members/{id}` — `id`는 숫자 PK 또는 GitHub 로그인 슬러그 둘 다 허용(레퍼런스 구현: `String(m.id) === id || m.login === id`)

```json
// 목록 item
{ "id": 12, "login": "jiho-park", "name": "박지호", "track": "FE", "cohort": 4,
  "roles": ["멤버"], "avatarUrl": null }

// 상세
{ "id": 12, "login": "jiho-park", "name": "박지호", "school": "세종대학교",
  "track": "FE", "cohort": 4, "roles": ["멤버"], "avatarUrl": null,
  "bio": "프론트엔드에 관심 많은 개발자...",
  "stats": { "completedMissions": 5, "teamProjects": 1, "blogPosts": 3 },
  "teamProjects": [{ "projectId": 1, "name": "모꼬지", "roleLabel": "FE 담당" }],
  "activities": [{ "activityId": 1, "date": "2026.05", "tag": "행사", "title": "4기 MT" }] }
```

- `roles`는 **한글 표시값 그대로** 저장·응답(`멤버 | 리뷰어 | 리드 | 메인테이너 | OB`). 코드값 매핑 없음.
- `stats.completedMissions`/`blogPosts`는 미션·블로그 도메인이 아직 없어 값이 없으면 `0` — 프론트는 0이면 해당 통계를 숨긴다.

### MySQL
```sql
member       id PK, login UNIQUE, name, school, avatar_url NULL, bio TEXT NULL,
             withdrawn BOOL DEFAULT false, created_at
membership   id PK, member_id FK, cohort TINYINT, track ENUM('FE','BE'), team VARCHAR NULL
member_role  membership_id FK, role ENUM('멤버','리뷰어','리드','메인테이너','OB')
```
목록의 `track`/`cohort`/`roles`는 "대표(최신) membership" 기준.

## 4. 프로젝트 (Projects)

- `GET /projects?filter=전체|4기|3기|FE|BE` — `filter`는 `cohortLabel` 또는 `trackLabel`과 일치하는 항목 반환
- `GET /projects/{id}`

```json
// 목록 item
{ "id": 1, "name": "모꼬지", "cohortLabel": "4기", "trackLabel": "공통",
  "description": "세종대 동아리 통합 플랫폼", "teamSize": 5,
  "thumbnailUrl": null, "thumbnailColor": "#15803d" }

// 상세
{ "id": 1, "name": "모꼬지", "subtitle": "동아리 통합 플랫폼", "cohortLabel": "4기", "trackLabel": "공통",
  "description": "...", "githubUrl": null, "liveUrl": null,
  "thumbnailUrl": null, "thumbnailColor": "#15803d",
  "team": [{ "memberId": 12, "name": "박지호", "roleLabel": "FE" }],
  "stack": ["Next.js", "Spring Boot", "PostgreSQL"] }
```

- 기수/트랙은 자유 라벨(`축제`·`공통`·`FE/BE`·`부스` 등)이라 enum이 아닌 문자열(`cohortLabel`/`trackLabel`).
- `team[].memberId`는 실제 멤버와 매칭되면 채우고, 없으면 `null`(이름만 표시).

### MySQL
```sql
project         id PK, name, subtitle NULL, cohort_label, track_label, description TEXT,
                team_size INT, github_url NULL, live_url NULL,
                thumbnail_url NULL, thumbnail_color NULL, created_at
project_member  project_id FK, member_id FK NULL, name, role_label
project_stack   project_id FK, tech VARCHAR
```

## 5. 스터디 (Study)

- `GET /study/curriculum?track=FE|BE`

```json
{ "track": "FE", "weeks": [
  { "id": 1, "weekNo": 1, "weekLabel": "1주차", "title": "JSX & 컴포넌트 기초",
    "status": "DONE", "noteUrl": null, "notionUrl": null, "linkedMissionId": null } ]}
```

- `status`: `DONE | ACTIVE | BREAK`. `weeks`는 `weekNo` 오름차순.
- `linkedMissionId`는 미션 도메인(별도 Mongo 백엔드)의 id를 참조하는 느슨한 링크 — 없으면 `null`.

### MySQL
```sql
curriculum_week  id PK, track ENUM('FE','BE'), week_no INT, week_label, title,
                 status ENUM('DONE','ACTIVE','BREAK'),
                 note_url NULL, notion_url NULL, linked_mission_id NULL, sort_order INT
```

## 6. 활동 타임라인 (Activities)

읽기는 MVP, 쓰기는 Phase 2(인증 붙은 뒤).

- `GET /activities?category=전체|행사|세션|데모데이`
- `GET /activities/{id}`

```json
// 목록 item
{ "id": 1, "date": "2026.05", "tag": "행사", "title": "4기 MT — 1박 2일",
  "summary": "4기가 처음으로 함께한 엠티...", "imageCount": 3, "thumbnailUrl": null }

// 상세
{ "id": 1, "date": "2026.05", "tag": "행사", "title": "4기 MT — 1박 2일",
  "body": "4기가 처음으로 다 같이...\n\n처음 만난 멤버들도...",
  "coverImageUrl": null,
  "images": [{ "id": 10, "url": "https://..", "sortOrder": 0 }],
  "participants": [{ "memberId": 12, "name": "박지호" }] }
```

- `tag`: `행사 | 세션 | 데모데이 | 축제 | 창립`. **`category=행사` 필터는 `축제`·`창립`도 함께 포함**한다(레퍼런스 구현: `src/mocks/data/activities.ts`의 `CATEGORY_TO_TAGS` 매핑).
- `date`는 MySQL `DATE`로 저장, 응답은 화면 표기(`2026.05`)로 포맷.

**Phase 2 (인증 필요, 이번 구현 범위 아님)**
- `POST /activities`, `PATCH /activities/{id}`, `POST /activities/{id}/images`(multipart)

### MySQL
```sql
activity              id PK, activity_date DATE, tag ENUM('행사','세션','데모데이','축제','창립'),
                       title, summary, body TEXT, cover_image_id NULL, created_at
activity_image         id PK, activity_id FK, url, sort_order INT
activity_participant   activity_id FK, member_id FK NULL, name
```

## 7. 홈 통계 (Stats)

히어로·기능카드·모집 CTA는 정적 UI(프론트 상수)로 유지 — 백엔드 불필요. 숫자 통계만 집계 API.

- `GET /stats`

```json
{ "totalMembers": 50, "activeCohort": 4, "tracks": "FE · BE", "teamProjects": 12 }
```

- 전용 테이블 없이 `member`/`project` 테이블 집계(`COUNT`, `MAX(membership.cohort)`)로 계산.
- 홈의 프로젝트 프리뷰 섹션은 `GET /projects` 응답 상위 N개를 그대로 재사용(전용 API 없음).

## 8. 스키마 전체 관계

```
member ─1:N─ membership ─1:N─ member_role
member ─1:N─ project_member ─N:1─ project ─1:N─ project_stack
member ─1:N─ activity_participant ─N:1─ activity ─1:N─ activity_image
curriculum_week (독립)
```

## 9. 레퍼런스 구현 (MSW 목서버)

이 명세는 프론트에서 실제로 fetch 가능한 MSW 목서버로 먼저 구현·검증됐다. Spring 구현 시 아래 파일을 1:1 대응 참고용으로 사용:

| 명세 섹션 | 목서버 데이터 | 목서버 핸들러 |
|---|---|---|
| 멤버 | `src/mocks/data/members.ts` | `src/mocks/handlers/members.ts` |
| 프로젝트 | `src/mocks/data/projects.ts` | `src/mocks/handlers/projects.ts` |
| 스터디 | `src/mocks/data/study.ts` | `src/mocks/handlers/study.ts` |
| 활동 타임라인 | `src/mocks/data/activities.ts` | `src/mocks/handlers/activities.ts` |
| 홈 통계 | `src/mocks/data/stats.ts` | `src/mocks/handlers/stats.ts` |

프론트 데이터 레이어(아키텍처 규칙에 따라 fetch는 `*Api.ts`에만, 서버 상태는 TanStack Query만):
- 타입: `src/shared/core/types/{member,project,study,activity,stats}.ts`
- API 래퍼: `src/shared/core/api/{member,project,study,activity,stats}Api.ts` — `NEXT_PUBLIC_API_BASE`(기본 `/api/v1`)를 base로 사용. **Spring 실서버 연동 시 이 환경변수만 교체하면 된다.**
- Query 훅: `src/shared/core/queries/{member,project,study,activity,stats}Queries.ts`

목서버 계약 테스트: `npm run test`(`src/mocks/__tests__/handlers.test.ts`, msw/node 기반, 11 케이스). 로컬에서 목서버로 실행하려면 `npm run dev:mock`(`NEXT_PUBLIC_API_MOCK=true`).

## 10. Phase 구분

- **Phase 1 (완료)**: 위 5개 GET 계약 + MSW 목서버 + 프론트 데이터 레이어·페이지 연동. 로그인 없음.
- **Phase 2 (이후)**: 활동 쓰기(업로드) + 인증/권한, 블로그·지원·미션리뷰 도메인, Spring 실서버 전환.
