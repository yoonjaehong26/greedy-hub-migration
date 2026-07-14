# 백엔드 API 명세 — MVP (멤버 · 프로젝트 · 활동)

> Spring Boot + MySQL로 구현할 백엔드 계약. **읽기(GET)만 MVP**, 쓰기·인증은 Phase 2.
> **전체 필드·타입의 SoT는 `docs/openapi.yaml`**(앱 내 Swagger 뷰어) — 이 문서는 그 요약과 구현 노트다.
> stats(홈 통계)·study(커리큘럼)는 백엔드 없이 프론트 상수로 처리하므로 이 스펙에서 제외.

---

## 0. 구현 가이드 (한눈에)

### 0-1. 구현 대상 — 6개 GET (읽기 전용, 쓰기는 Phase 2)

| 엔드포인트 | 응답 | 핵심 규칙 |
|---|---|---|
| `GET /members` | `{ items: MemberSummary[] }` | 전체 반환(필터 없음) |
| `GET /members/{id}` | `MemberDetail` | `id` = 숫자 PK 또는 github 슬러그 |
| `GET /projects` | `{ items: ProjectSummary[] }` | 전체 반환 |
| `GET /projects/{id}` | `ProjectDetail` | — |
| `GET /activities` | `{ items: ActivitySummary[] }` | `date` 내림차순 · **다음 주 구현** |
| `GET /activities/{id}` | `ActivityDetail` | `images`는 `sortOrder` 오름차순 |

### 0-2. 공통 규칙
- 응답 JSON **camelCase**. 목록 `{ items: [...] }`, 상세 단일 객체. 에러 `{ error: { code, message } }` + 4xx(404는 `/{id}`에서만).
- **서버 필터·페이지네이션 없음** — 목록은 항상 전체 반환. 트랙·기수·카테고리 필터는 프론트가 클라이언트에서(데이터 <100건).
- 기수는 **`generationNumber`(정수)** 로만 응답 — "N기" 라벨은 프론트가 파생. (Generation 엔티티는 두되 응답엔 number만 투영.)
- **아바타 필드 없음** — `github_url`에서 프론트가 파생(`github.com/{login}.png`). 저장·응답 불필요.
- ref(팀원·참여활동 등)는 **id 위주로 최소화** — 이름·썸네일은 프론트가 목록 SoT(`GET /members`·`/projects`·`/activities`)에서 id로 조인. 예외: 외부 기여자 이름은 조인 대상이 없어 응답에 포함.
- Base URL `/api`, 버저닝 없음. 인증 없음(전부 공개 GET).

### 0-3. 엔티티 (MySQL, 팀 ERD 정합)
```sql
-- 멤버 --
member            id PK, name, github_url NULL, description TEXT NULL, is_public BOOL, created_at, updated_at
member_department member_id FK, department ENUM
member_activity   id PK, member_id FK, activity_type ENUM, stack_position ENUM★, generation_id FK NULL, created_at, updated_at
generation        id PK, number INT, start_date, end_date
-- 프로젝트 --
project           id PK, name, summary, description TEXT, project_type ENUM, generation_id FK,
                  thumbnail_url NULL, site_url NULL, backend_github_url NULL, frontend_github_url NULL, created_at, updated_at
project_member    id PK, project_id FK, member_id FK NULL, external_contributor_id FK NULL, stack_position ENUM, start_date, end_date
project_backend_stack   project_id FK, stack ENUM
project_frontend_stack  project_id FK, stack ENUM
project_image★    project_id FK, url, sort_order INT
external_member   id PK, name, github_url, activity_type ENUM
-- 활동 (다음 주 구현) --
activity          id PK, activity_date DATE, tag ENUM, generation_id FK NULL, title, summary, body TEXT, location NULL, created_at, updated_at
activity_image    id PK, activity_id FK, url, sort_order INT
activity_participant  id PK, activity_id FK, member_id FK NULL, name
```
★ = 기존 팀 ERD에 없어 **신설 요청**하는 2건:
1. **`member_activity.stack_position`** — 기수별 track 보존(한 사람 "2기 FE → 3기 BE"). 없으면 이 이력을 표현 못 함.
2. **`project_image`** — 프로젝트 상세 스크린샷 갤러리(응답 `screenshotUrls[]`).

### 0-4. Enum
| Enum | 값 | 쓰는 곳 |
|---|---|---|
| `StackPosition` | `BACKEND` · `FRONTEND` · `FULL_STACK` | member_activity · project_member |
| `ActivityType` | `CO_FOUNDER` · `MAINTAINER` · `STUDY_LEAD` · `STUDY_MEMBER` · `REVIEWER` | member_activity (역할) |
| `ExternalActivityType` | `REVIEWER` · `PROJECT_MEMBER` | external_member |
| `ProjectType` | `FESTIVAL` · `TASK_FORCE` · `GENERATION` | project (**내부 분류, API 응답 제외**) |
| `ActivityTag` | `행사` · `세션` · `데모데이` · `축제` · `창립` | activity |
| `Department` | (실제 학과 목록으로 확정 필요) | member_department |
| `BackendStack` / `FrontendStack` | 실데이터 초안(§2) — enum vs 자유문자는 백엔드 판단 | project_*_stack |

> 후속 추가 예정: `ActivityType`에 **`CLUB_LEAD`(동아리장)·`RECRUITED_LEAD`(영입리드)** — 현재 미포함이라 이 두 역할만 가진 멤버는 아직 '운영진'으로 미표현.

### 0-5. 범위 밖 / 나중
- **stats(홈 통계)·study(커리큘럼)**: 백엔드 없음 — 프론트 상수.
- **completedMissions**: 별도 미션 백엔드(Mongo, `/api/missions`)에서 멤버별 조회. **blogPosts**: 블로그 도메인 미확정(MVP 제외). 둘 다 멤버 응답엔 참조 형태로만(지금은 빈 배열).
- **쓰기(POST/PATCH)·인증·`is_public` 마스킹**: Phase 2(로그인 도입, ~2주 뒤).
- **데이터 소싱**(GitHub 실시간 동기화 vs 수동 입력)은 백엔드 자유 — 계약과 무관.

---

## 1. 멤버 (Members)

- `GET /members` 전체 반환 · `GET /members/{id}` — `id`는 숫자 PK 또는 github 슬러그 둘 다 허용.
- **탈퇴자 처리는 다루지 않음** — 탈퇴 시 DB 행 삭제/운영 재량. API 계약 밖(의도적 제외).

```json
// 목록 item (MemberSummary) — avatar는 githubUrl에서 파생
{ "id": 26, "name": "윤재홍", "githubUrl": "https://github.com/yoonjaehong26",
  "departments": ["COMPUTER_SCIENCE"],
  "memberActivities": [
    { "activityType": "STUDY_MEMBER", "stackPosition": "FRONTEND", "generationNumber": 3 },
    { "activityType": "MAINTAINER",   "stackPosition": "FRONTEND", "generationNumber": 4 },
    { "activityType": "STUDY_LEAD",   "stackPosition": "FRONTEND", "generationNumber": 4 }
  ] }

// 상세 (MemberDetail) — 기수별 track 전환(2기 FE → 3기 BE)이 stackPosition으로 보존됨
{ "id": 18, "name": "강동현", "githubUrl": "https://github.com/mintcoke123",
  "departments": [],
  "memberActivities": [
    { "activityType": "STUDY_MEMBER", "stackPosition": "FRONTEND", "generationNumber": 2 },
    { "activityType": "STUDY_MEMBER", "stackPosition": "BACKEND",  "generationNumber": 3 }
  ],
  "description": null, "isPublic": true,
  "summaryCounts": { "completedMissions": 0, "teamProjects": 0, "blogPosts": 0 },
  "completedMissions": [], "blogPosts": [], "teamProjects": [], "activities": [] }
```

- **`memberActivities[]`** = 한 사람의 (기수 × 역할)당 1건. 여러 기수·복수 역할은 여러 entry로 표현하고 **배열 그대로 반환**(대표 소속 계산은 프론트). 기수별 track 변화·"운영진" 배지 등이 전부 이 배열에서 파생.
- **`completedMissions[]` `{ missionId, title, cohortLabel, weekLabel }`**, **`blogPosts[]` `{ postId, title, category, date }`**(`date`=게시 월 `YYYY.MM`) — 둘 다 별도 도메인(§0-5), 지금은 빈 배열. **`activities[]` `{ activityId, date, tag, title }`** — 참여 활동 ref, 상세·썸네일은 `activityId`로 활동 SoT 조인.
- `summaryCounts.teamProjects`는 `teamProjects[].length`와 **항상 같은 정의로** 계산할 것(세 곳에서 셈이 어긋나지 않게).

## 2. 프로젝트 (Projects)

- `GET /projects` 전체 반환. 기수 필터는 프론트가 `generationNumber`로, 트랙은 `team[].stackPosition`에서 파생.

```json
// 목록 item (ProjectSummary)
{ "id": 1, "name": "따라행",
  "summary": "인기 여행 유튜브 영상을 분석해 여행 동선·장소를 정리하고 지도로 코스를 추천.",
  "thumbnailUrl": null, "generationNumber": 1 }

// 상세 (ProjectDetail) — 외부 참여자 포함 예시(모꼬지 팀)
{ "id": 2, "name": "모꼬지", "summary": "세종대 모든 동아리를 한 곳에서",
  "thumbnailUrl": null, "generationNumber": 1,
  "description": "## 어떤 문제를 풀었나요\n세종대엔 동아리가 많지만 모집 정보가 흩어져 있었어요.\n\n## 주요 기능\n동아리 검색·실시간 모집 공고·즐겨찾기·알림 메일을 한곳에서.\n\n## 어떻게 만들었나요\nNext.js + Spring Boot·MySQL·Redis로 FE·BE가 협업해 배포까지.",
  "siteUrl": "https://www.mokkoji.site/",
  "frontendGithubUrl": "https://github.com/greedy-team/mokkoji-fe-next",
  "backendGithubUrl": "https://github.com/greedy-team/mokkoji-be",
  "frontendStack": ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  "backendStack": ["Java", "Spring Boot", "MySQL", "Redis"],
  "screenshotUrls": ["https://.../shot-0.png", "https://.../shot-1.png"],
  "team": [
    { "memberId": null, "name": "방재경", "stackPosition": "FRONTEND" },
    { "memberId": 16, "name": "정창우", "stackPosition": "FRONTEND" },
    { "memberId": 14, "name": "김의진", "stackPosition": "BACKEND" }
  ] }
```

- **`description`은 단일 마크다운** — Figma "소개 3블록"(문제/기능/제작)은 별도 컬럼 없이 헤딩(`##`)으로 담는다. 스키마가 화면 섹션 구성에 결합되지 않게 하는 결정.
- **`team[].memberId = null`이면 외부 기여자**(`external_member` FK로 해소). `name`은 외부 기여자엔 여기에만 있음. 응답은 `memberId·name·stackPosition`만(개별 github는 제외).
- **깃허브·스택은 FE/BE 분리** 저장(레포가 실제 분리돼 있음). `trackLabel`·`teamSize`·`thumbnailColor`는 저장 안 함(파생/프론트 전용).
- `FrontendStack` 초안: React · TypeScript · Next.js · Vite · Tailwind CSS · Zustand · TanStack Query · Axios · Leaflet · Storybook · Kakao Maps API … / `BackendStack`: Java · Spring Boot · MySQL · PostgreSQL · Redis … (값이 계속 늘면 자유문자 컬럼도 고려 — 백엔드 판단.)

## 3. 활동 (Activities) — 다음 주 구현

- `GET /activities` **`date` 내림차순** · `GET /activities/{id}` 상세 `images`는 **`sortOrder` 오름차순** 보장.

```json
// 목록 item (ActivitySummary)
{ "id": 1, "date": "2026.05", "tag": "행사", "generationNumber": 4, "title": "4기 MT — 1박 2일",
  "summary": "4기가 처음으로 함께한 엠티...", "imageCount": 5,
  "thumbnailUrls": ["https://../0.jpg", "https://../1.jpg", "https://../2.jpg"] }

// 상세 (ActivityDetail)
{ "id": 1, "date": "2026.05", "tag": "행사", "generationNumber": 4, "title": "4기 MT — 1박 2일",
  "location": "강촌 펜션", "body": "4기가 처음으로 다 같이...\n\n처음 만난 멤버들도...",
  "images": [{ "id": 10, "url": "https://..", "sortOrder": 0 }],
  "participants": [{ "memberId": 12, "name": "박지호" }] }
```

- **`tag`**(`ActivityTag` enum, Summary·Detail 공용): 백엔드는 `tag`만 그대로 반환. 카테고리 필터 버킷은 프론트 전용 로직(`categoryFilter.ts`) — Figma 와이어프레임의 밋업/엠티/스터디는 placeholder라 실데이터 태그로 대체함.
- **`generationNumber`**(nullable): **date로 파생 불가**(같은 달에 다른 기수 공존), 제목/내용으로 편집 귀속 저장.
- **`date`**: MySQL `DATE` 저장, 응답은 `2026.05` 포맷. **`body`** 문단 구분은 **빈 줄 두 번(`\n\n`)** — 마크다운 아님(프론트가 `split('\n\n')`).
- **`thumbnailUrls`**: `images`를 `sortOrder` 순 정렬 후 앞 **3장까지만**. `imageCount`(전체 장수)가 더 많아도 3장 — "+N"은 프론트가 계산. 사진 없으면 빈 배열.
- **⚠️ 이미지 저장**: 디스코드 CDN URL(`cdn.discordapp.com/...?ex=&is=&hm=`)은 서명이 만료된다. 큐레이션 시 사진을 영구 저장소(Vercel Blob·S3 등)에 재업로드하고 **그 영구 URL을 저장**할 것. (디스코드 메시지 permalink는 이미지가 아니라 채널 링크라 `<img>`에 못 씀.)

---

## 4. 엔티티 관계

```
generation  ─1:N─ member_activity ─N:1─ member ─1:N─ member_department
generation  ─1:N─ project ─1:N─ project_member ─N:1─ (member | external_member)
project     ─1:N─ project_backend_stack / project_frontend_stack / project_image★
# 활동(다음 주): activity ─1:N─ activity_image / activity_participant ─N:1─ member(nullable), activity ─N:1─ generation
```

## 5. 레퍼런스 (프론트 MSW 목서버)

이 계약은 프론트 MSW 목서버로 먼저 검증됨 — Spring 구현 시 1:1 참고. 데이터/핸들러: `src/mocks/data/*.ts` · `src/mocks/handlers/*.ts`. 계약 테스트: `npm run test`(`src/mocks/__tests__/handlers.test.ts`). 프론트는 `NEXT_PUBLIC_API_BASE`(기본 `/api`)만 실서버로 교체하면 연동.
