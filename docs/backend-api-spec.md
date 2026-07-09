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
| 홈 통계 (`/`) | ✅ | — | 실시간 집계 | 산출 방식은 백엔드 재량(§7) |

DB에 있는 데이터는 갱신 빈도와 무관하게 GET API가 있어야 프론트가 읽을 수 있다(브라우저는 MySQL에 직접 접속 불가). 쓰기 API·관리자 CRUD는 실제로 콘텐츠가 계속 쌓이는 **활동 타임라인 한 곳으로만 한정**한다.

## 2. 공통 규약

- Base URL: `/api` (버저닝 프리픽스 없음 — 프론트·백엔드를 같은 팀이 붙어서 배포하는 내부 툴이라 `/v1` 같은 버전 공존이 필요 없다고 판단)
- 응답: JSON, `camelCase`. 목록은 `{ "items": [...] }`, 상세는 단일 객체.
- **서버 사이드 필터링 없음 — 목록 엔드포인트는 항상 전체를 반환한다.** 멤버 ~50·프로젝트 수십 개·활동 수십 건 수준이라 쿼리 파라미터로 필터링할 이유가 없고, 화면의 트랙·기수·카테고리 필터는 전부 **프론트에서 이미 받은 전체 목록을 클라이언트 사이드로 필터링**한다. (부수 효과: "잘못된 필터값이면 400인지 빈 배열인지" 같은 애매함이 애초에 발생하지 않음 — 서버가 필터를 아예 안 받으니까.)
- 페이지네이션 불필요 (위와 같은 이유).
- 에러: `{ "error": { "code": "NOT_FOUND", "message": "..." } }` + 4xx/5xx status. 목록 엔드포인트는 파라미터가 없어 이 에러 케이스도 없음 — 404는 상세(`/{id}`) 조회에서만 발생.
- 이미지 필드는 항상 완성된 URL 문자열(`thumbnailUrl`, `thumbnailUrls[]`, `images[].url`). 저장 방식(Vercel Blob·S3 등)은 이후 결정, 프론트는 URL만 소비.
- 인증 없음 — 이 문서의 모든 엔드포인트는 공개 GET, Phase 1에서 인증 미들웨어 불필요.

## 3. 멤버 (Members)

- `GET /members` — 파라미터 없음, **탈퇴자(`withdrawn=true`) 제외한** 전체 멤버 반환. 트랙·기수 필터는 프론트가 클라이언트에서 처리. (이건 "필터 파라미터"가 아니라 이 엔드포인트가 반환하는 리소스 자체의 정의 — 탈퇴자는 애초에 멤버 디렉토리 대상이 아님)
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

- `GET /projects` — 파라미터 없음, 전체 반환. 기수·트랙 필터(전체/4기/3기/FE/BE)는 프론트가 `cohortLabel`/`trackLabel` 값으로 클라이언트에서 필터링
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

- `GET /curriculum` — 파라미터 없음, **FE·BE 두 트랙 전체 주차를 한 배열로 반환**. 트랙 탭 전환은 프론트가 `track` 필드로 클라이언트에서 필터링(`/study` 아래 다른 하위 리소스가 없어서 `study/` 네임스페이스도 함께 뺐다 — 프론트 페이지 경로(`/study`)와 백엔드 엔드포인트 경로를 굳이 맞출 필요는 없다고 판단)

```json
{ "items": [
  { "id": 1, "track": "FE", "weekNo": 1, "weekLabel": "1주차", "title": "JSX & 컴포넌트 기초",
    "status": "DONE", "noteUrl": null, "notionUrl": null, "linkedMissionId": null } ]}
```

- `status`: `DONE | ACTIVE | BREAK`. 정렬 보장: `track` 다음 `weekNo` 오름차순.
- `linkedMissionId`는 미션 도메인(별도 Mongo 백엔드)의 id를 참조하는 느슨한 링크 — 없으면 `null`.

### MySQL
```sql
curriculum_week  id PK, track ENUM('FE','BE'), week_no INT, week_label, title,
                 status ENUM('DONE','ACTIVE','BREAK'),
                 note_url NULL, notion_url NULL, linked_mission_id NULL, sort_order INT
```

## 6. 활동 타임라인 (Activities)

읽기는 MVP, 쓰기는 Phase 2(인증 붙은 뒤).

- `GET /activities` — 파라미터 없음, 전체 반환. **정렬: `date` 내림차순(최신순)** — 잠정 확정(디스코드 게시글을 그대로 DB화해서 가져올 예정이라 우선 날짜순으로 충분, 추후 바뀔 수 있음)
- `GET /activities/{id}` — 상세의 `images`는 **`sortOrder` 오름차순** 보장

```json
// 목록 item
{ "id": 1, "date": "2026.05", "tag": "행사", "title": "4기 MT — 1박 2일",
  "summary": "4기가 처음으로 함께한 엠티...", "imageCount": 5,
  "thumbnailUrls": ["https://../0.jpg", "https://../1.jpg", "https://../2.jpg"] }

// 상세
{ "id": 1, "date": "2026.05", "tag": "행사", "title": "4기 MT — 1박 2일",
  "body": "4기가 처음으로 다 같이...\n\n처음 만난 멤버들도...",
  "images": [{ "id": 10, "url": "https://..", "sortOrder": 0 }],
  "participants": [{ "memberId": 12, "name": "박지호" }] }
```

- `tag`: `행사 | 세션 | 데모데이 | 축제 | 창립`. 카테고리 필터 버킷(전체/행사/세션/데모데이 — `행사` 버킷은 `축제`·`창립`도 포함)은 **백엔드 계약이 아니라 프론트 전용 로직**이다(레퍼런스: `src/features/activities/categoryFilter.ts`의 `CATEGORY_TO_TAGS`). 백엔드는 `tag` 필드만 그대로 반환하면 됨.
- `date`는 MySQL `DATE`로 저장, 응답은 화면 표기(`2026.05`)로 포맷.
- `thumbnailUrls`는 **목록 화면에서 사진을 최대 3장까지 그리드로 보여주기 위한 필드** — `images`를 `sortOrder` 오름차순으로 정렬한 뒤 앞 3장의 URL만 뽑음(별도 "대표사진 지정" 개념 없음, 콘텐츠가 큐레이션으로 수작업 입력되니 입력자가 사진 순서로 통제). 사진이 없으면 빈 배열. `imageCount`(전체 장수)가 3보다 많아도 `thumbnailUrls`는 항상 3장까지만 — 나머지 장수는 프론트가 `imageCount - thumbnailUrls.length`로 "+N" 뱃지 표시.
- `body`의 문단 구분은 **빈 줄 두 번(`\n\n`)** 컨벤션 — 마크다운 아님, 프론트가 `split('\n\n')`로 문단을 나눠 렌더링. 데이터 입력 시(디스코드 글 옮겨 적을 때) 이 규칙을 지켜야 함.
- **⏳ 공개/비공개 분리 + 멤버 인증**: 활동별로 공개 여부가 갈릴 예정이나, 로그인 기능이 약 2주 뒤에 붙을 예정이라 그때 인증 방식(토큰 종류)이 정해지면 같이 설계한다. 지금 스키마엔 반영 안 함(추측 설계 방지). 그 전까지 `GET /activities`는 전체 공개로 취급.

**Phase 2 (인증 필요, 이번 구현 범위 아님)**
- `POST /activities`, `PATCH /activities/{id}`, `POST /activities/{id}/images`(multipart)
- 공개/비공개 필터링 + 멤버 토큰 미들웨어 (로그인 기능과 함께 설계 예정)

### MySQL
```sql
activity              id PK, activity_date DATE, tag ENUM('행사','세션','데모데이','축제','창립'),
                       title, summary, body TEXT, created_at
activity_image         id PK, activity_id FK, url, sort_order INT
activity_participant   activity_id FK, member_id FK NULL, name
```

## 7. 홈 통계 (Stats)

히어로·기능카드·모집 CTA는 정적 UI(프론트 상수)로 유지 — 백엔드 불필요. 숫자 통계만 집계 API.

- `GET /stats`

```json
{ "totalMembers": 50, "activeCohort": 4, "tracks": "FE · BE", "teamProjects": 12 }
```

- 이 숫자들을 어떻게 산출할지(`member`/`project` 테이블 COUNT로 계산할지, 별도 관리 값으로 둘지)는 **API 계약에 안 드러나는 백엔드 내부 구현 선택** — 프론트는 응답으로 받는 숫자만 그대로 표시한다. 다만 참고: `GET /members`는 탈퇴자를 제외하고 반환하므로(§3), `totalMembers`를 그 개수로 그대로 쓰면 화면의 "누적 멤버" 문구(탈퇴자 포함 취지)와 안 맞을 수 있음 — 백엔드가 편한 방식으로 정하면 됨.
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
- API 래퍼: `src/shared/core/api/{member,project,study,activity,stats}Api.ts` — `NEXT_PUBLIC_API_BASE`(기본 `/api`)를 base로 사용. **Spring 실서버 연동 시 이 환경변수만 교체하면 된다.**
- Query 훅: `src/shared/core/queries/{member,project,study,activity,stats}Queries.ts` — 전부 파라미터 없이 전체를 가져오고, 필터링은 각 `features/` 컴포넌트가 클라이언트에서 처리
- 카테고리·트랙 필터 로직: `src/features/activities/categoryFilter.ts`(활동), `ProjectArchive.tsx`/`StudyCurriculum.tsx` 내부(프로젝트·스터디)

목서버 계약 테스트: `npm run test`(`src/mocks/__tests__/handlers.test.ts`, msw/node 기반). 로컬에서 목서버로 실행하려면 `npm run dev:mock`(`NEXT_PUBLIC_API_MOCK=true`).

## 10. Phase 구분

- **Phase 1 (완료)**: 위 5개 GET 계약 + MSW 목서버 + 프론트 데이터 레이어·페이지 연동. 로그인 없음.
- **Phase 2 (이후)**: 활동 쓰기(업로드) + 인증/권한, 블로그·지원·미션리뷰 도메인, Spring 실서버 전환.
