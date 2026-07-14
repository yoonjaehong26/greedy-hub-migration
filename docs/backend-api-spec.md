# 백엔드 API 명세 — MVP (멤버·프로젝트·스터디·활동 타임라인)

> Spring Boot + MySQL + Docker로 신규 구현할 백엔드의 계약 문서.
> 이 계약은 이미 `src/mocks/`의 MSW 목서버로 프론트에서 실제로 검증됨 — 목서버 핸들러가 곧 이 명세의 레퍼런스 구현.
> **MVP 범위**: 홈 통계·멤버·스터디·프로젝트·활동 타임라인. 블로그·지원(recruit)·미션리뷰는 이후 단계(제외).
> **로그인 없음** — 전부 공개 조회(GET). 쓰기(활동 올리기·프로필 편집)는 인증이 전제라 Phase 2.
>
> **이 문서의 성격**: 팀 공식 논의는 원본 레포 커밋 `5cbb3f416eeac321c119be4bc11417a46793373f` 기준으로 별도 진행 중. 그 이후의 기능 추가·MSW 목서버·이 API 명세 자체는 개인 fork에서 혼자 실험·정리 중인 내용이라, 팀 합의를 거친 확정안이 아니라 초안/제안으로 취급할 것.

## 0. 백엔드 구현 가이드 (한눈에) — 백엔드가 볼 부분만

> 이 절만 읽어도 구현을 시작할 수 있게 압축한 요약이다. **전체 필드·타입은 `docs/openapi.yaml`**(앱 내 Swagger 뷰어), 결정 근거·엣지케이스는 아래 §1.5·§3·§4·§6.

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
- 멤버 이름·썸네일 등은 프론트가 목록 SoT(`GET /members`·`/projects`)에서 id로 조인 — ref는 id 위주로 최소화.

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
| `BackendStack` / `FrontendStack` | 실데이터 초안(§1.5 A) — enum vs 자유문자는 백엔드 판단 | project_*_stack |

> 후속 추가 예정: `ActivityType`에 **`CLUB_LEAD`(동아리장)·`RECRUITED_LEAD`(영입리드)** — 현재 미포함이라 이 두 역할만 가진 멤버는 아직 '운영진'으로 미표현.

### 0-5. 범위 밖 / 나중
- **stats(홈 통계)·study(커리큘럼)**: 백엔드 없음 — 프론트 상수(§5·§7).
- **completedMissions**: 별도 미션 백엔드(Mongo, `/api/missions`)에서 멤버별 조회. **blogPosts**: 블로그 도메인 미확정(MVP 제외). 둘 다 멤버 응답엔 참조 형태로만.
- **쓰기(POST/PATCH)·인증·`is_public` 마스킹**: Phase 2(로그인 도입, ~2주 뒤).
- **데이터 소싱**(GitHub 실시간 동기화 vs 수동 입력)은 백엔드 자유 — 계약과 무관.

---

## 1. 어디에 백엔드가 필요한가

미션 대시보드(`/missions`)·쇼케이스(`/showcase`)는 이미 별도 Next+MongoDB 백엔드가 붙어 있어 이 범위 밖. 나머지 5개 화면만 대상:

| 화면 | GET | 쓰기 | 갱신 주기 | 갱신 방식 |
|---|---|---|---|---|
| 활동 타임라인 (`/gallery`) | ✅ 확정 | ✅ (Phase 2) | 2~4주 | 실제 업로드 API |
| 멤버 (`/members`) | ✅ 확정 | ❌(Phase 1) → Phase 2 예정 | 반년(기수) | 학기 전환 시 SQL 시드 |
| 프로젝트 (`/projects`) | ✅ 확정 (2026-07-14) | ❌ → Phase 2 | 반년(데모데이) | 학기 전환 시 SQL 시드 |
| 스터디 (`/study`) | 🚫 백엔드 없음 | — | 반년(기수) | 프론트 상수(§5) |
| 홈 통계 (`/`) | 🚫 백엔드 없음 | — | — | 프론트에서 산출(§7) |

DB에 있는 데이터는 갱신 빈도와 무관하게 GET API가 있어야 프론트가 읽을 수 있다(브라우저는 MySQL에 직접 접속 불가). 쓰기 API·관리자 CRUD는 Phase 1에선 없음 — **활동 타임라인**(업로드)과 **멤버**(로그인 후 프로필 셀프 편집)는 로그인 기능이 붙는 시점(Phase 2, ~2주 후 예정)에 같이 설계.

**결정(2026-07-14):** 백엔드 GET 구현 = **멤버·활동·프로젝트** 3개 도메인. **스터디·홈통계는 백엔드 없이 프론트에서 처리**(스터디=상수, 통계=멤버·프로젝트 데이터에서 파생/정적) — ROI 관점(개발자 직접 수정, 프론트 배포 주기(반년)와 갱신 주기 일치)에서 확정. 프로젝트는 같은 논리로 미확정이었으나 백엔드 두기로 결정.

## 1.5. 백엔드 ERD 정합화 (결정 2026-07-14)

팀 백엔드 ERD(`Project`·`ProjectMember`·`Generation`·`Member`·`MemberActivity`·`ExternalMember` + enum들)와 이 fork 계약을 대조한 결과, 이 계약은 **Figma·노션 실데이터에서 역산**한 것이라 이름·구조·커버리지가 어긋난다. 아래 방향으로 정합화하며, 이후 §3·§4·§6과 `openapi.yaml`은 이 절을 기준으로 개정한다. 원칙: **백엔드 ERD 구조·네이밍을 채택하되, 화면이 요구하지만 ERD에 없는 필드는 "백엔드 신설 요청"으로 명시**한다.

### 결정 요약 (2026-07-14 확정)
1. **활동(Activity)** — **다음 주 구현 예정이라 이번 정합화에서 보류.** ERD에 대응 엔티티 없음(신설 필요)이라는 사실만 기록하고, 스키마 확정·`/activities` 개정은 그때. (ERD의 `MemberActivity`는 "멤버의 기수별 역할"이지 사진 있는 활동 게시물이 아님 — 별개.)
2. **Project** — 백엔드 ERD 기준으로 우리 계약 수정(BE/FE 깃허브·스택 분리, `generationNumber`(파생), `siteUrl`). 소개는 **3블록 폐기 → 단일 `description`(마크다운)으로 통합**. `projectType`은 백엔드 내부 분류라 **응답 제외**, `generation`은 객체 대신 **`generationNumber`(정수)** 로 노출. `screenshotUrls[]`(엔티티 `ProjectImage`)만 별도 신설 요청.
3. **Member** — 백엔드 구조(`Member` + `MemberActivity`) 채택하되, **기수별 track은 소실 없이 보존하도록 백엔드에 요청**(`MemberActivity.stackPosition` 추가). 역할 enum은 지금은 백엔드 `ActivityType` 그대로.

### A. Project 필드 매핑

| 백엔드 ERD | 개정 계약 | 비고 |
|---|---|---|
| `name` | `name` | |
| `summary` | `summary` | 카드 한 줄 요약 — **기존 `description`이 하던 역할** |
| `description`(Text) | `description` | 상세 본문 |
| `thumbnailUrl` | `thumbnailUrl`(nullable) | |
| `siteUrl` | `siteUrl` | 기존 `liveUrl` 개명 |
| `backendGithubUrl`/`frontendGithubUrl` | 동일 | 기존 단일 `githubUrl`(FE 대표) 분리 |
| `projectType`(enum) | ~~응답 제외~~ | 백엔드 내부 분류(축제/상시/기수)용 — 화면 미사용이라 API 응답엔 안 넣음. 축제·상시 프로젝트 노출 시 추가 |
| `generationId`(FK) | `generationNumber`(정수) | Generation.number 조인. 객체 대신 평면 정수. `cohortLabel` "N기"는 여기서 파생 |
| `backendStack`/`frontendStack`(enum[]) | 동일 | 기존 단일 `stack[]`(FE+BE 합침) 분리 + enum화 |
| (ProjectMember 집계) | `teamSize` | 파생값 — 저장 안 함 |
| — | ~~`trackLabel`~~ | team의 stackPosition에서 파생("FE"·"BE" 공존 시 "FE/BE") — 저장 안 함 |
| — | ~~`thumbnailColor`~~ | **프론트 전용** 썸네일 폴백색 — 백엔드 계약에서 제외 |

**소개 텍스트 — 단일 `description`으로 통합 (결정):**
- Figma "소개 3블록"(어떤 문제를 풀었나요/주요 기능/어떻게 만들었나요)을 **컬럼 3개로 만들지 않고 ERD의 단일 `description`(Text) 하나로 통합**한다. 스키마가 Figma 섹션 구성에 결합되면(추가·개명·순서변경마다 마이그레이션) 유지보수가 어려움 — 콘텐츠 구조는 스키마가 아니라 **콘텐츠(마크다운)에** 둔다. 프론트는 `description`을 마크다운으로 렌더(헤딩=섹션 제목)해 Figma 3블록을 그대로 재현하거나 단일 소개 문단으로 표시. 백엔드 추가 컬럼 0개. (기존 `subtitle`도 여기로 흡수.)

**백엔드 신설 요청 (ERD에 없음):**
- `screenshotUrls[]` — 상세 화면 갤러리("+N 모두 보기"). `ActivityImage`와 동형인 **`ProjectImage`(projectId FK, url, sortOrder)** 신설 **확정**(유지). 응답 필드명은 URL 배열이라 `screenshotUrls`(컨벤션: `thumbnailUrls`와 동일). 현재 placeholder라 **실이미지 수급 필요**.

**enum 값 초안 (우리 실데이터 — 확정은 백엔드):**
- `FrontendStack`: React · TypeScript · Next.js · Vite · Tailwind CSS · Zustand · TanStack Query · Axios · Leaflet · Storybook · Kakao Maps API …
- `BackendStack`: Java · Spring Boot · MySQL · PostgreSQL · Redis …
- 값이 계속 늘어나므로 enum이 맞는지(자유문자 컬럼 + 정규화 태그 테이블이 나을 수도)는 백엔드 판단.

### B. ProjectMember / 외부 기여자
- `roleLabel`(자유문자 "FE"/"BE") → `stackPosition`(enum BACKEND/FRONTEND/FULL_STACK). "디자인(외부)" 1건(모꼬지 김성림)은 **제외**(결정) — `DESIGN` enum 안 만들고 해당 인원 로스터에서 뺌.
- 외부 인원: 기존 `memberId: null`+이름 → 백엔드 **`ExternalMember` 엔티티 + `ProjectMember.externalContributorId` FK** 채택(그쪽이 더 정규화). team 응답은 **`memberId`·`name`·`stackPosition`만** 노출 — `name`은 외부 기여자엔 여기에만 있고 N+1 회피용, `stackPosition`은 프로젝트 전용 역할. **개별 `githubUrl`은 제외**(팀 명단이 이름+역할만 보여줌; 내부는 memberId→프로필, 외부는 필요 시 ExternalMember에서 조회).

### C. Member 매핑 (단순화)

| 백엔드 ERD | 개정 계약 | 비고 |
|---|---|---|
| `name` | `name` | |
| `githubUrl` | `githubUrl` | 기존 `login`+`avatarUrl` → 백엔드는 URL 단일. avatar는 github에서 파생 |
| `description`(소개) | `description` | 기존 `bio` 개명 |
| `mainStackPosition`(단일) | ~~응답 제외~~ | memberActivities와 중복이라 API 응답 제외. 트랙은 `MemberActivity.stackPosition`(기수별, 신설 요청)에만 — 'FE·BE 둘 다'도 여기서 자연 표현 |
| `departments`(enum[]) | `departments` | 기존 자유문자 `department[]` → enum화 |
| `MemberActivity`(activityType+generationId) | `memberActivities[]` | 기존 `memberships[].roles[]`(+`joinType`) 대체 |

**기수별 track — 보존 요청 (결정):**
- `mainStackPosition` 단일로는 "2기 FE→3기 BE"(신지훈·강동현 실존)나 "FE·BE 둘 다"를 표현 못 함 → **백엔드에 `MemberActivity.stackPosition`(기수별 track) 추가를 요청**한다. 각 기수-역할 행이 track을 가져 카드의 "1기 BE, 2기 FE" 이력·FE/BE 필터가 전부 여기서 파생됨. **`mainStackPosition`은 memberActivities와 중복이라 API 응답에서 제외**(백엔드가 컬럼을 내부에 두는 건 자유).

**역할 enum — 지금은 백엔드 `ActivityType` 그대로 (결정):**
- 매핑: 멤버→STUDY_MEMBER, 리뷰어→REVIEWER, 리드→STUDY_LEAD, 메인테이너→MAINTAINER, 창립(joinType)→CO_FOUNDER.
- **동아리장·영입리드**는 대응 enum 없음 → **지금은 추가 안 하고 백엔드 엔티티대로 간다.** 필요해지면 후속으로 `CLUB_LEAD`·`RECRUITED_LEAD` 추가(동아리장=이승용 등은 그때 정확히 표기). 그전까진 계약상 이 두 역할은 표현 안 됨(문서에만 남김).

### D. Activity 신설 요청 (ERD 스타일) — ⏸ 보류(다음 주 구현)

> **이번 정합화 범위 밖.** 활동 도메인은 다음 주 구현 예정이라 스키마 확정·`/activities` 개정을 그때 진행한다. 아래는 그때 출발점으로 쓸 참고 초안일 뿐, 지금 계약에 반영하지 않는다.

```
Activity            id PK · generationId FK→Generation(nullable, 편집 귀속—날짜 파생 불가)
                    · tag Enum(ActivityTag) · title · summary · body Text
                    · location String(nullable) · createdAt · updatedAt
ActivityImage       id PK · activityId FK → Activity · url · sortOrder
ActivityParticipant id PK · activityId FK → Activity · memberId FK→Member(nullable=외부/미매칭) · name
```
- `ActivityTag`(enum): 행사·세션·데모데이·축제·창립 (영문 명명은 백엔드 재량, 예: EVENT/SESSION/DEMO_DAY/FESTIVAL/FOUNDING).
- `cohort`는 `generationId`로 대체 — **날짜로 파생 불가**(같은 달에 다른 기수 행사 공존, 예 2025.09 3기 OT + 2기 데모데이). nullable FK 저장형이라 ERD의 `MemberActivity.generationId`와 같은 원칙.

### E. 관계 (정합화 후)
- `Project` N:1 `Generation` / `Project` 1:N `ProjectMember` N:1 (`Member` | `ExternalMember`) / `Project` 1:N `ProjectImage`(신설)
- `Member` 1:N `MemberActivity` N:1 `Generation`(nullable)
- `Activity`(신설) N:1 `Generation`(nullable) / 1:N `ActivityImage` / 1:N `ActivityParticipant` N:1 `Member`(nullable)

### 항목별 결론 (2026-07-14)
1. Project 소개 — **3블록 폐기, 단일 `description`(마크다운) 통합** ✔. `ProjectImage`(screenshots) 갤러리 **유지 확정**(백엔드 신설) ✔.
2. 역할 enum — **지금은 백엔드 `ActivityType` 그대로** ✔. 동아리장·영입리드는 후속 추가 예정.
3. 외부 디자이너(김성림) — **제외** ✔. `DESIGN` enum 안 만듦.
4. Member 기수별 track — **보존 요청**(`MemberActivity.stackPosition` 신설 요청) ✔. 소실 안 함.
5. Activity 도메인 — **보류**(다음 주 구현) ⏸.

**→ 백엔드에 요청할 것 2개:** (a) `ProjectImage` 신설(screenshots 갤러리), (b) `MemberActivity.stackPosition` 추가(기수별 track). 그 외는 백엔드 ERD 그대로 수용.

> 위 결론대로 `openapi.yaml`(머신 계약)과 §3·§4 프로즈를 **Project·Member만** 개정한다(Activity=보류라 §6·`/activities`는 유지). **현재 프론트 코드·MSW 목·타입은 아직 구 계약(memberships[]·단일 githubUrl 등)** 이므로, 계약 개정 후 프론트 이관은 페이지별(design→msw→swagger) 작업에서 별도 진행.

## 2. 공통 규약

- Base URL: `/api` (버저닝 프리픽스 없음 — 프론트·백엔드를 같은 팀이 붙어서 배포하는 내부 툴이라 `/v1` 같은 버전 공존이 필요 없다고 판단)
- 응답: JSON, `camelCase`. 목록은 `{ "items": [...] }`, 상세는 단일 객체.
- **서버 사이드 필터링 없음 — 목록 엔드포인트는 항상 전체를 반환한다.** 멤버 ~50·프로젝트 수십 개·활동 수십 건 수준이라 쿼리 파라미터로 필터링할 이유가 없고, 화면의 트랙·기수·카테고리 필터는 전부 **프론트에서 이미 받은 전체 목록을 클라이언트 사이드로 필터링**한다. (부수 효과: "잘못된 필터값이면 400인지 빈 배열인지" 같은 애매함이 애초에 발생하지 않음 — 서버가 필터를 아예 안 받으니까.)
- 페이지네이션 불필요 (위와 같은 이유).
- 에러: `{ "error": { "code": "NOT_FOUND", "message": "..." } }` + 4xx/5xx status. 목록 엔드포인트는 파라미터가 없어 이 에러 케이스도 없음 — 404는 상세(`/{id}`) 조회에서만 발생.
- 이미지 필드는 항상 완성된 URL 문자열(`thumbnailUrl`, `thumbnailUrls[]`, `images[].url`). 저장 방식(Vercel Blob·S3 등)은 이후 결정, 프론트는 URL만 소비.
  - **디스코드 원본 사진을 그대로 쓰면 안 됨**: 디스코드 메시지 permalink(`discord.com/channels/...`)는 이미지 URL이 아니라 채널로 이동하는 링크라 `<img>`에 못 씀. `cdn.discordapp.com/attachments/...` 형태는 실제 이미지 파일이지만 `?ex=&is=&hm=` 서명이 붙어 일정 시간 후 만료된다 — 활동을 큐레이션할 때(§6) 디스코드에서 사진을 다운로드해 영구 저장소(Vercel Blob 등)에 재업로드한 뒤, 그 영구 URL을 저장해야 한다(레퍼런스: `src/mocks/data/activities.ts`의 만료 경고 주석 — id:2·17에 실제 디스코드 CDN URL을 임시로 넣어둔 예시).
- 인증 없음 — 이 문서의 모든 엔드포인트는 공개 GET, Phase 1에서 인증 미들웨어 불필요.

## 3. 멤버 (Members)

> ⚠️ **2026-07-14 백엔드 ERD 정합화(§1.5·`openapi.yaml`)로 스키마 개정됨.** 아래 본문의 `memberships[]`·`login`·`avatarUrl`·`joinType`·`bio`·`roles`(한글) 등 옛 필드 표현은 **`memberActivities[]`(`activityType` enum + `stackPosition` + `generationNumber`)·`githubUrl`·`description`** 로 대체됐다(`mainStackPosition`은 중복이라 응답 제외)(한글 역할 라벨→영문 `ActivityType`; 단 동아리장·영입리드는 후속 추가). `missionDashboardUrl`은 여전히 계약 제외(파생). 필드 구조는 §1.5 C와 openapi를 기준으로 읽을 것 — 아래 프로즈의 옛 필드 서술은 배경/이력용. (엔드포인트·필터 규약은 아래 그대로 유효.)

- `GET /members` — 파라미터 없음, 전체 멤버 반환. 트랙·기수 필터는 프론트가 클라이언트에서 처리(어떤 `memberActivities[]` 항목이든 `stackPosition`/`generationNumber`가 일치하면 노출).
- `GET /members/{id}` — `id`는 숫자 PK 또는 GitHub 로그인 슬러그 둘 다 허용(레퍼런스 구현: `String(m.id) === id || m.login === id`)
- **탈퇴자 처리는 이 백엔드가 다루지 않는다** — 탈퇴 시 그냥 DB에서 행을 지우거나 운영진 재량으로 처리. API 계약·유지보수 부담을 줄이기 위해 의도적으로 범위에서 제외(결정).

```json
// 목록 item (MemberSummary) — login·avatarUrl은 githubUrl에서 파생
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

// 상세 — 창립멤버(이승용). ⚠️ '동아리장'은 현재 ActivityType에 없어 빠짐(§1.5 C, 후속 CLUB_LEAD 추가 예정)
{ "id": 1, "name": "이승용", "githubUrl": "https://github.com/kokodak",
  "departments": ["COMPUTER_SCIENCE"],
  "memberActivities": [
    { "activityType": "CO_FOUNDER", "stackPosition": "BACKEND", "generationNumber": null },
    { "activityType": "MAINTAINER", "stackPosition": "BACKEND", "generationNumber": 1 },
    { "activityType": "STUDY_LEAD", "stackPosition": "BACKEND", "generationNumber": 1 },
    { "activityType": "REVIEWER",   "stackPosition": "BACKEND", "generationNumber": 1 }
  ] }
```

- **한 사람이 여러 기수에 걸칠 수 있어 `memberships[]` 배열**로 관리한다(예: 3기 FE 멤버 → 4기 FE 리드로 승급). 트랙·기수·역할(roles)은 전부 membership 단위로 붙는다 — 멤버 전체에 붙는 단일 값이 아님.
- 목록 카드처럼 "대표 소속" 하나만 필요한 화면은 프론트가 `memberships`에서 **가장 최근(cohort가 큰) 항목**을 골라 쓴다(레퍼런스: `src/features/members/primaryMembership.ts`, 역할 배지 표시에 사용). 반면 카드 상단의 "언제 스터디원이었는지" 텍스트는 role에 `멤버`가 포함된 기수만 오름차순으로 나열하고, 그런 기수가 아예 없는 창립·영입리드는 `joinType`으로 대체한다(레퍼런스: `src/features/members/memberCohortLabels.ts`) — 메인테이너·리드 등 승격 이후 역할과 "원래 몇 기 스터디원이었는지"를 혼동하지 않기 위한 의도적 구분. 백엔드는 굳이 "대표"를 계산해서 내려줄 필요 없음 — 배열 그대로 반환.
- **`memberships[].team`**(선택, 데모데이 팀명 — 예: "두구두구")은 목업 실데이터 작업(2026-07-06)에서 추가된 필드 — 이전 버전 스펙엔 없었음. 노션 데모데이 명부에서만 확인 가능(1~3기; 4기·창립·영입리드는 미기재라 값 없음).
- **`missionDashboardUrl`은 이 API 계약에서 제외한다(결정, 2026-07-10)**. 미션 대시보드(`/missions`) 링크는 `/missions?cohort={가장 최근 memberships 항목의 cohort}&track={그 track}` 형태로 **`memberships[]`만으로 100% 파생 가능**(대표 소속을 고르는 로직도 이미 프론트에 있음 — 레퍼런스: `src/features/members/primaryMembership.ts`). 별도 컬럼으로 저장·응답하면 승급 등으로 `memberships`가 바뀔 때 이 필드를 갱신하는 걸 깜빡해 데이터가 어긋날 위험만 생기므로("같은 정보를 두 군데서 계산하면 어긋난다"는, `teamProjects` 중복 때와 같은 논리), 백엔드는 이 필드를 만들거나 저장할 필요가 없다 — 프론트가 응답으로 받은 `memberships`에서 직접 계산해 링크를 만든다.
- `roles`는 **한글 표시값 그대로** 저장·응답(`멤버 | 리뷰어 | 리드 | 메인테이너 | 동아리장 | OB`). 코드값 매핑 없음.
- **멤버 목록의 SOT는 노션 "그리디 멤버 최종 정리(혜빈님 정리본)" 페이지**(그리디 전체 46명 + 1~4기 개별 DB)로 교체됐다(2026-07-06 목업 작업, 승인됨). 이전엔 미션 대시보드 로스터(PR 미션을 실제로 수행한 39명)만 반영해 **창립멤버 5명과 영입리드 2명이 누락**돼 있었다 — 이 둘은 PR 미션 없이 리드·메인테이너로만 활동해 미션 로스터엔 애초에 안 잡힘. 총 46명이 정식 스펙.
  - **`department`**(학과, 복수 전공 가능해 배열)·**`admissionYear`**(학번/입학년도, 2자리)는 이번에 스키마에 추가된 필드 — **아직 프론트 UI엔 노출하지 않는다**(승인됨, 스키마 선반영만).
  - **`joinType`**(선택, `창립 | 영입리드`)은 정규 기수 스터디원이 아닌 예외 합류 경로만 표기한다. 창립멤버·영입리드도 실제 활동 기수·트랙·역할은 다른 멤버와 동일하게 `memberships[]`에 정상적으로 들어있음(예: 이승용은 1~3기 내내 BE 동아리장/메인테이너) — `joinType`은 "합류 경위"만 부가하는 뱃지고, 별도 기수 없는 가상 멤버십을 만들지 않는다.
  - **외부 리뷰어 10명**(비회원, 기수별 트랙 PR 리뷰만 담당 — 그리디 동아리원이 아님)은 이 API의 스코프 밖으로 **명시적으로 제외**한다(승인됨). 원본 데이터는 참고용으로 `src/mocks/data/externalReviewers.ts`에 정리해뒀지만 어떤 핸들러·엔드포인트에도 연결돼 있지 않음 — 필요해지면 별도 엔드포인트로 다룰 문제.
- `summaryCounts.completedMissions`/`blogPosts`는 미션·블로그 도메인이 아직 없어 값이 없으면 `0` — 프론트는 0이면 해당 통계를 숨긴다.
- `completedMissions[]`는 `{ missionId, title, cohortLabel, weekLabel }` 형태의 완료 미션 리스트(성취만 노출, 진행중/미완료 제외), `blogPosts[]`는 `{ postId, title, category, date }` 형태의 글 리스트(`date`=게시 월 YYYY.MM, Figma가 절대 월 표시) — 둘 다 **지금은 MSW 목데이터로만 채워짐**(§9), 실제 조회 계약(미션 백엔드 필터·블로그 도메인)은 여전히 미결(§11-5·§11-6). 목록이 비면 빈 배열.
- `summaryCounts.teamProjects`(숫자)가 `teamProjects[]`(배열) 길이랑 겹치는 건 **필드 유지 + 계산 방식 통일로 결정**(2026-07-10) — 백엔드가 이 숫자를 `teamProjects[].length`와 항상 같게 계산하면 됨, 별도 조치 불필요.
- **미결**: 같은 논리로 `summaryCounts.completedMissions`/`blogPosts`도 `completedMissions.length`/`blogPosts.length`와 중복될 수 있음 — 이 둘은 아직 논의 안 됨, 별도로 정리 필요.
- **완료 미션 중 "진행 중인 미션은 본인에게만, 완료된 것만 공개" 같은 미션 단위 가시성은 이 백엔드 소관이 아님** — 미션 데이터는 별도 Mongo 시스템(`/api/missions`) 소관이라, 그쪽에서 처리할 문제.

**🚫 `PATCH /members/{id}` — MVP에서 제외 (2026-07-14)**
프로필 자기편집(bio 편집·isPublic 공개 토글)은 편집 UI와 함께 제거됐고, 쓰기는 인증이 전제라 **openapi에서도 뺐다**(GET만 유지). 원래 Phase 1.5 프론트 프로토타입으로 인증 없이 MSW에 붙였던 목업이었을 뿐(`src/mocks/handlers/members.ts`엔 아직 남아있을 수 있음 — 멤버 페이지 이관 때 정리). 다시 필요해지면 아래 Phase 2에서 로그인 미들웨어와 함께 설계한다.

**⏳ Phase 2 (인증 필요, 이번 구현 범위 아님)** — 활동타임라인과 같은 시점(로그인 기능, ~2주 후)에 같이 설계:
- 위 `PATCH /members/{id}`에 **로그인한 본인만** 호출 가능하도록 멤버 토큰 미들웨어 추가. **저장은 원본 마크다운 그대로, 렌더링 시 반드시 이스케이프/새니타이징** — 사용자 입력을 그대로 HTML로 그리면 저장형 XSS 위험.
- `isPublic`이 `false`인 멤버는 비로그인 사용자에게 `GET /members/{id}`에서 제외/마스킹하는 규칙 — 지금은 `isPublic` 필드만 있고 실제 가시성 필터링은 없음(누구나 값과 무관하게 전체 조회 가능).

### MySQL (백엔드 ERD 정합, §1.5)
```sql
member            id PK, name, github_url NULL, description TEXT NULL,
                  is_public BOOLEAN DEFAULT TRUE, created_at, updated_at
                  -- ERD의 main_stack_position은 member_activity.stack_position과 중복 + API 미노출이라 생략
member_department member_id FK, department ENUM   -- List<Department>
member_activity   id PK, member_id FK, activity_type ENUM, stack_position ENUM,  -- ★ stack_position 신설(기수별 track)
                  generation_id FK NULL, created_at, updated_at
generation        id PK, number INT, start_date, end_date
```
- `login`·`avatar_url`은 `github_url`에서 파생(미저장). `bio`→`description`. `join_type`(창립/영입리드)은 `member_activity.activity_type`(CO_FOUNDER 등)로 흡수 — 단 영입리드·동아리장은 현재 `ActivityType` enum에 없어 후속 추가 전까진 미표현(§1.5 C).
- ★ `member_activity.stack_position`(기수별 track)이 백엔드 신설 요청.

## 4. 프로젝트 (Projects) — ✅ 백엔드 구현 확정 (2026-07-14)

> ⚠️ **2026-07-14 백엔드 ERD 정합화(§1.5·`openapi.yaml`)로 스키마 개정됨.** 옛 표현 → 개정: 단일 `githubUrl`→`backendGithubUrl`+`frontendGithubUrl`, `liveUrl`→`siteUrl`, 단일 `stack[]`→`backendStack`+`frontendStack`(enum), `cohortLabel`→`generationNumber`(정수), 소개 **3블록(`problem`/`features`/`how`)→단일 `description`(마크다운)**, `roleLabel`→`stackPosition`. `projectType`은 백엔드 내부 분류라 응답 제외. `screenshotUrls[]`(엔티티 `ProjectImage`)로 유지. 필드는 §1.5 A와 openapi 기준으로 읽을 것.
>
> **백엔드 두기로 결정(2026-07-14).** 예시 데이터는 노션 "찬빈님 프로젝트 데이터정리" 페이지(1~3기 데모데이 팀 6개, 각 PR 리드미 요약) 기준 실데이터로 검증됨(2026-07-10). 쓰기(등록/수정)는 Phase 2.

- `GET /projects` — 파라미터 없음, 전체 반환. 기수 필터(전체/1~3기)는 프론트가 `generationNumber`로, 트랙은 `team[].stackPosition`에서 파생해 클라이언트에서 필터링
- `GET /projects/{id}`

```json
// 목록 item (ProjectSummary)
{ "id": 1, "name": "따라행",
  "summary": "인기 여행 유튜브 영상을 분석해 여행 동선·장소를 정리하고 지도로 코스를 추천.",
  "thumbnailUrl": null, "generationNumber": 1 }

// 상세 (ProjectDetail) — 그리디 동아리원이 아닌 외부 참여자 포함 예시(모꼬지 팀)
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

- 기수는 `generationNumber`(정수, Generation.number 조인). 트랙 라벨("FE/BE")은 `team[].stackPosition`에서 파생 — 저장하지 않음. `projectType`(축제/상시/기수 분류)은 백엔드 내부용이라 응답에 안 넣음(§1.5 A) — 축제·상시 프로젝트를 목록에 노출할 때 다시 추가.
- 소개 "3블록"(문제/기능/제작)은 별도 컬럼 없이 **단일 `description`(마크다운)** 에 헤딩으로 담는다(§1.5 A) — Figma 섹션 구성이 바뀌어도 스키마 불변.
- `team[].memberId`는 **그리디 동아리원(§3)과 매칭되면 채우고, 외부 참여자면 `null`**(백엔드 `ExternalMember` FK로 해소). team 응답은 `memberId`·`name`·`stackPosition`만 — 개별 `githubUrl`은 안 넣음(§1.5 B). 외부 디자이너 1건(김성림)은 제외 결정(§1.5 B).
- **깃허브·배포 URL·스택은 `github.com/orgs/greedy-team/repositories` 실조사(2026-07-10)**. FE·BE 레포가 분리돼 있어 **`frontendGithubUrl`·`backendGithubUrl`로 각각 저장**(옛 단일 `githubUrl` 대표 방식 폐기), 스택도 `frontendStack`·`backendStack`으로 분리. **따라행**은 레포 미발견으로 URL/스택 비어있음.
- ⚠️ 이전 버전에 있던 리더보드·세종라이프·그리니 목늘이기(축제 부스 3개)는 출처가 확인되지 않은 목데이터라 제거했었는데, 실제로는 `2025-leaderboard`·`2026-leaderboard`·`Greenie-neck-stretch` 등으로 greedy-team 조직에 존재하는 게 확인됨 — 축제 부스 프로젝트까지 다룰 거면 별도로 정리할 것.

### MySQL (백엔드 ERD 정합, §1.5)
```sql
project          id PK, name, summary, description TEXT, project_type ENUM,  -- project_type=내부 분류, API 응답 제외
                 generation_id FK, thumbnail_url NULL,                       -- 응답엔 generation_id→generationNumber(정수)만 투영
                 site_url NULL, backend_github_url NULL, frontend_github_url NULL,
                 created_at, updated_at
project_member   id PK, project_id FK, member_id FK NULL, external_contributor_id FK NULL,
                 stack_position ENUM, start_date, end_date
project_backend_stack   project_id FK, stack ENUM
project_frontend_stack  project_id FK, stack ENUM
project_image    project_id FK, url, sort_order INT   -- 화면 갤러리(순서 보존) ★신설
generation       id PK, number INT, start_date, end_date
external_member  id PK, name, github_url, activity_type ENUM
```
- `thumbnail_color`(폴백색)는 프론트 전용이라 DB에 두지 않음. `team_size`·트랙 라벨은 파생(미저장).
- ★ `project_image`·`member_activity.stack_position`(기수별 track)이 백엔드 신설 요청 2건.

## 5. 스터디 (Study) — 🚫 백엔드 없음(프론트 상수) · 필드는 재설계 완료(2026-07-13)

> **페이지 자체가 피벗됨**: `/study`가 "주차별 진행 상황"이 아니라 "트랙 소개 + 한 주의 리듬 + 단계별(여러 주차 묶음) 커리큘럼 타임라인"으로 화면이 바뀌었다(기존 미션 대시보드 스타일 UI는 폐기, Figma 프레임 `69:1194`(FE)·`69:1642`(BE)·`69:1331`(모바일) 기준). 그래도 트랙별로 갈리는 데이터(단계 목록)라는 본질은 같아서 백엔드 필요성 자체는 유효하지만, **데이터 변경 주기가 기수 단위 + 개발자 직접 수정 + 프론트 배포 주기(반년)와 일치**한다는 ROI 논리로 "백엔드 없이 프론트 상수로 관리"하는 안도 논의 중 — 팀 결정 필요.
>
> 필드 형태는 위 디자인을 반영해 재설계했다: `weekNo` 단위 플랫 리스트 → **`CurriculumStage`(단계, 여러 주차를 묶음) + `CurriculumTrackIntro`(트랙 소개)**. "한 주의 리듬"(미션받기→구현→티키타카 리뷰→머지) 4단계는 두 트랙에 동일하게 고정된 정적 설명이라 API 계약에 넣지 않고 프론트 상수로 둔다(`RHYTHM_STEPS`, `StudyCurriculum.tsx`).

- **백엔드 엔드포인트 없음(결정 2026-07-14).** 아래는 프론트 상수(또는 MSW 목)가 만드는 **데이터 형태** 기록일 뿐 — HTTP 계약 아님. FE·BE 두 트랙 전체 단계 + 트랙 소개를 프론트가 보유하고, 트랙 탭 전환은 `track` 필드로 클라이언트 필터링. (openapi.yaml에서도 제외됨)

```json
{
  "trackIntros": [
    { "track": "FE", "title": "프론트엔드 트랙",
      "description": "사용자가 보고 만지는 화면을 만들어요. ...\n...\n...",
      "techTags": ["HTML/CSS", "JavaScript", "React", "TypeScript", "협업과 Git"] }
  ],
  "items": [
    { "id": 1, "track": "FE", "order": 1, "title": "자바스크립트 기초", "weekRangeLabel": "1~3주차",
      "description": "프레임워크 없이 자바스크립트만으로 게임을 만들며 기본기를 다져요.",
      "missionName": "숫자 야구, 탐욕의 룰렛, 좀비 게임",
      "techTags": [], "externalLinks": [],
      "weeks": [
        { "id": 1, "track": "FE", "weekNo": 1, "weekLabel": "1주차", "title": "",
          "status": "DONE", "noteUrl": null, "notionUrl": null, "linkedMissionId": 1 }
      ] }
  ]
}
```

- `CurriculumTrackIntro`: 트랙당 1개, `description`은 `\n`으로 문단 구분(활동의 `\n\n` 컨벤션과 다름 — 프론트가 `split('\n')`으로 렌더링).
- `CurriculumStage`: `order` 오름차순 정렬 보장. `techTags`/`externalLinks`는 이번 디자인엔 단계별로 노출되는 값이 없어 빈 배열이지만, 추후 단계별 배지·참고 링크가 생길 걸 대비해 타입에 유지(설계 여지).
- `CurriculumStage.weeks[]`: 상태(`DONE|ACTIVE|UPCOMING|BREAK`) 등 옛 주차 단위 개념을 그대로 보존해 단계 카드 안 칩으로 노출. `linkedMissionId`는 미션 도메인(별도 Mongo 백엔드)의 id를 참조하는 느슨한 링크 — 없으면 `null`.
- `missionName`은 자유 텍스트(미션명 나열 또는 외부 자료 스텝 표기 등 케이스가 섞여 있어 URL이 있는 링크가 아님) — `externalLinks`와 별개 필드.

### MySQL
```sql
curriculum_track_intro  track ENUM('FE','BE') PK, title, description TEXT
curriculum_track_tag    track ENUM('FE','BE') FK, tag VARCHAR
curriculum_stage        id PK, track ENUM('FE','BE'), sort_order INT, title, week_range_label,
                        description TEXT, mission_name
curriculum_stage_tag    stage_id FK, tag VARCHAR
curriculum_stage_link   stage_id FK, label, url
curriculum_week         id PK, stage_id FK, track ENUM('FE','BE'), week_no INT, week_label,
                        status ENUM('DONE','ACTIVE','UPCOMING','BREAK'),
                        note_url NULL, notion_url NULL, linked_mission_id NULL
```

## 6. 활동 타임라인 (Activities)

읽기는 MVP, 쓰기는 Phase 2(인증 붙은 뒤).

- `GET /activities` — 파라미터 없음, 전체 반환. **정렬: `date` 내림차순(최신순)** — 잠정 확정(디스코드 게시글을 그대로 DB화해서 가져올 예정이라 우선 날짜순으로 충분, 추후 바뀔 수 있음)
- `GET /activities/{id}` — 상세의 `images`는 **`sortOrder` 오름차순** 보장

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

- `tag`: `행사 | 세션 | 데모데이 | 축제 | 창립`(openapi `ActivityTag` enum, Summary·Detail 공용). 카테고리 필터 버킷(전체/행사/세션/데모데이 — `행사` 버킷은 `축제`·`창립`도 포함)은 **백엔드 계약이 아니라 프론트 전용 로직**이다(레퍼런스: `src/features/activities/categoryFilter.ts`의 `CATEGORY_TO_TAGS`). 백엔드는 `tag` 필드만 그대로 반환하면 됨. Figma 와이어프레임의 밋업/엠티/스터디는 placeholder라 실데이터 태그로 대체(결정).
- `generationNumber`(nullable): 활동이 속한 기수 번호 — **date로 파생 불가**(같은 달 다른 기수 공존), 제목/내용으로 편집 귀속. members·projects와 같은 `generationNumber` 규약(기존 `cohort`에서 개명, 2026-07-14).
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
                       generation_id FK NULL,  -- ★ 기수 귀속(응답 generationNumber). 날짜 파생 불가, 편집 저장
                       title, summary, body TEXT, location NULL, created_at, updated_at
activity_image         id PK, activity_id FK, url, sort_order INT
activity_participant   id PK, activity_id FK, member_id FK NULL, name
```

## 7. 홈 통계 (Stats) — 🚫 백엔드 없음(프론트 처리, 결정 2026-07-14)

히어로·기능카드·모집 CTA는 정적 UI(프론트 상수)로 유지 — 백엔드 불필요. **숫자 통계도 API·MSW 없이 프론트 상수로 관리**한다: 현재 구현은 `src/features/home/HomeStats.tsx`의 `STATS` 배열을 그대로 표시하며(fetch·Query·목서버 없음), 값 갱신은 이 배열만 수정한다. `GET /stats` 엔드포인트·`statsApi`·`statsQueries`·MSW 목·`stats` 타입은 모두 제거됨(2026-07-14).

- ~~`GET /stats`~~ (엔드포인트 없음 — 프론트 상수)

```json
{ "totalMembers": 50, "activeCohort": 4, "tracks": "FE · BE", "teamProjects": 12 }
```

- 위 형태는 참고용 스냅샷일 뿐, 실제로는 컴포넌트 상수다. 훗날 `GET /members`·`GET /projects` 응답 길이에서 파생하도록 바꾸는 것도 가능하지만(그땐 백엔드 계약 변화 없음), 갱신 주기(프론트 배포 반년)와 ROI를 고려해 상수로 둔다.
- 홈의 프로젝트 프리뷰 섹션은 `GET /projects` 응답 상위 N개를 그대로 재사용(전용 API 없음).
- **`teamProjects`는 `GET /projects` 목록 길이·멤버 상세 `summaryCounts.teamProjects`와 항상 같은 정의로 계산되어야 한다**(결정, 2026-07-10) — "팀 프로젝트"로 셀 대상(예: 진행중/취소된 프로젝트 포함 여부)이 세 곳에서 어긋나지 않도록 백엔드가 한 곳에서 계산 로직을 공유할 것.

## 8. 스키마 전체 관계

```
# 백엔드 ERD 정합 후(§1.5). generation을 축으로 project·member_activity가 붙는다.
generation  ─1:N─ member_activity ─N:1─ member ─1:N─ member_department
generation  ─1:N─ project ─1:N─ project_member ─N:1─ (member | external_member)
project     ─1:N─ project_backend_stack / project_frontend_stack / project_image
# 활동 타임라인(보류, 다음 주): activity ─1:N─ activity_image / activity_participant ─N:1─ member(nullable)
# 스터디(프론트 상수, 백엔드 없음): curriculum_stage / curriculum_week …
```

## 9. 레퍼런스 구현 (MSW 목서버)

이 명세는 프론트에서 실제로 fetch 가능한 MSW 목서버로 먼저 구현·검증됐다. Spring 구현 시 아래 파일을 1:1 대응 참고용으로 사용:

| 명세 섹션 | 목서버 데이터 | 목서버 핸들러 |
|---|---|---|
| 멤버 | `src/mocks/data/members.ts` | `src/mocks/handlers/members.ts` |
| 프로젝트 | `src/mocks/data/projects.ts` | `src/mocks/handlers/projects.ts` |
| 스터디 | `src/mocks/data/study.ts` | `src/mocks/handlers/study.ts` |
| 활동 타임라인 | `src/mocks/data/activities.ts` | `src/mocks/handlers/activities.ts` |

> 홈 통계는 백엔드·MSW 없이 프론트 상수(`src/features/home/HomeStats.tsx`)로 처리하므로 목서버 대상이 아니다(§7).

프론트 데이터 레이어(아키텍처 규칙에 따라 fetch는 `*Api.ts`에만, 서버 상태는 TanStack Query만):
- 타입: `src/shared/core/types/{member,project,study,activity}.ts`
- API 래퍼: `src/shared/core/api/{member,project,study,activity}Api.ts` — `NEXT_PUBLIC_API_BASE`(기본 `/api`)를 base로 사용. **Spring 실서버 연동 시 이 환경변수만 교체하면 된다.**
- Query 훅: `src/shared/core/queries/{member,project,study,activity}Queries.ts` — 전부 파라미터 없이 전체를 가져오고, 필터링은 각 `features/` 컴포넌트가 클라이언트에서 처리
- 카테고리·트랙 필터 로직: `src/features/activities/categoryFilter.ts`(활동), `ProjectArchive.tsx`/`StudyCurriculum.tsx` 내부(프로젝트·스터디)

목서버 계약 테스트: `npm run test`(`src/mocks/__tests__/handlers.test.ts`, msw/node 기반). 로컬에서 목서버로 실행하려면 `npm run dev:mock`(`NEXT_PUBLIC_API_MOCK=true`).

## 10. Phase 구분

- **Phase 1 (완료)**: 멤버·활동타임라인·**프로젝트** GET 계약(확정) + MSW 목서버 + 프론트 데이터 레이어·페이지 연동. 홈통계·스터디는 백엔드 없이 프론트 처리(§7·§5). 로그인 없음.
- **Phase 1.5 (완료, 프론트 프로토타입)**: member-detail 화면 검증용으로 `PATCH /members/{id}`(bio·isPublic) + 완료미션/기술블로그 리스트를 **인증 없이 MSW 목데이터로만** 먼저 붙임(§3). 실제 백엔드 계약이 아니라 화면 목업 — Spring 전환 시 Phase 2 인증과 §11-5·§11-6 결정을 반드시 거쳐야 함.
- **Phase 2 (~2주 후, 로그인 도입 시)**: 위 `PATCH /members/{id}`에 인증 추가 + 활동 쓰기(업로드) + 멤버 토큰 인증 미들웨어 + 활동·멤버 프로필 공개/비공개 필터링(`isPublic` 기반 실제 마스킹).
- **Phase 3+ (미정)**: 블로그·지원·미션리뷰 도메인 백엔드, Spring 실서버 전환.

## 11. 미결 이슈 (팀 논의 필요 — 체크리스트)

1. **스터디·프로젝트·홈통계 — 백엔드 자체가 필요한가** (§1·§4·§5·§7): 🟢 **결정 완료(2026-07-14)** — 프로젝트=백엔드 O, 스터디·홈통계=백엔드 X(프론트 처리).
2. **스터디 필드 재설계** (§5): 🟢 **완료(2026-07-13)** — 화면이 주차별 → 단계(여러 주차 묶음) 커리큘럼 타임라인 + 트랙 소개로 피벗됨(Figma 확정). `weekNo` 플랫 리스트에서 `CurriculumStage`(+ `CurriculumTrackIntro`)로 재설계, `src/shared/core/types/study.ts`·`studyApi.ts`·`studyQueries.ts`·MSW 목서버 모두 갱신됨. 남은 건 여전히 "백엔드 자체가 필요한가"(위 1번)뿐.
3. **활동 디스코드 대량 임포트 방식** (§6): 자동 동기화 vs 수작업 큐레이션. 미션 로스터 선례(하이브리드) 참고 예정, 미결정.
4. **로그인 도입 시 함께 설계할 것** (§3·§6, ~2주 후): 멤버 토큰 미들웨어 방식(토큰 종류), 활동·멤버 프로필 공개/비공개 가시성 규칙, bio 마크다운 XSS 새니타이징.
5. **완료 미션 리스트 — 실제 조회 계약 아직 없음** (§3): `completedMissions[]`는 지금 MSW 목데이터로만 채워져 있고, 실서버에서 이 리스트를 어떻게 채울지 결정 안 됨. `GET /api/missions`(별도 Mongo 미션 백엔드)는 멤버 필터가 없고, PR↔멤버 매칭도 미션 대시보드 전용 로직(`src/features/missions/buildMemberRows.ts`)이라 재사용 불가. (a) 미션 백엔드에 `/api/missions?author=` 필터 추가 vs (b) 멤버 쪽에 `completedMissions[]`를 직접 저장 중 결정 필요.
   - ⚠️ **참고(MVP 범위 아님, 팀 논의 아님)**: "미션 대시보드(`/missions`) 페이지 자체는 없어지고 PR 추적 로직만 Spring 백엔드로 흡수되면 (a)/(b) 고민 자체가 없어진다"는 아이디어가 있으나, 이건 팀 합의가 아니라 이 fork에서 개인적으로 구상해본 것 — MVP 범위 밖이고 확정된 방향 아님.
6. **기술블로그 — 도메인 자체가 없음** (§3·§10): `blogPosts[]`도 지금은 MSW 목데이터. `src/app/blog/*`에 UI 스텁(하드코딩 목데이터, API·DB 없음)은 이미 존재하나 백엔드 도메인은 Phase 3+로 미확정. Phase 3 착수 시 이 스텁을 재사용할지 새로 설계할지 확인 필요.
