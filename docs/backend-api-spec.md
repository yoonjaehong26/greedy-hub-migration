# 백엔드 API 명세 — MVP (멤버·프로젝트·스터디·활동 타임라인)

> Spring Boot + MySQL + Docker로 신규 구현할 백엔드의 계약 문서.
> 이 계약은 이미 `src/mocks/`의 MSW 목서버로 프론트에서 실제로 검증됨 — 목서버 핸들러가 곧 이 명세의 레퍼런스 구현.
> **MVP 범위**: 홈 통계·멤버·스터디·프로젝트·활동 타임라인. 블로그·지원(recruit)·미션리뷰는 이후 단계(제외).
> **로그인 없음** — 전부 공개 조회(GET). 쓰기(활동 올리기·프로필 편집)는 인증이 전제라 Phase 2.
>
> **이 문서의 성격**: 팀 공식 논의는 원본 레포 커밋 `5cbb3f416eeac321c119be4bc11417a46793373f` 기준으로 별도 진행 중. 그 이후의 기능 추가·MSW 목서버·이 API 명세 자체는 개인 fork에서 혼자 실험·정리 중인 내용이라, 팀 합의를 거친 확정안이 아니라 초안/제안으로 취급할 것.

## 1. 어디에 백엔드가 필요한가

미션 대시보드(`/missions`)·쇼케이스(`/showcase`)는 이미 별도 Next+MongoDB 백엔드가 붙어 있어 이 범위 밖. 나머지 5개 화면만 대상:

| 화면 | GET | 쓰기 | 갱신 주기 | 갱신 방식 |
|---|---|---|---|---|
| 활동 타임라인 (`/gallery`) | ✅ 확정 | ✅ (Phase 2) | 2~4주 | 실제 업로드 API |
| 멤버 (`/members`) | ✅ 확정 | ❌(Phase 1) → Phase 2 예정 | 반년(기수) | 학기 전환 시 SQL 시드 |
| 스터디 (`/study`) | ⚠️ 미확정 | ❌ | 반년(기수) | 학기 전환 시 SQL 시드 (또는 아예 백엔드 없이 프론트 상수 — §5 참고) |
| 프로젝트 (`/projects`) | ⚠️ 미확정 | ❌ | 반년(데모데이) | 〃 |
| 홈 통계 (`/`) | ✅ 확정 | — | 실시간 집계 | 산출 방식은 백엔드 재량(§7) |

DB에 있는 데이터는 갱신 빈도와 무관하게 GET API가 있어야 프론트가 읽을 수 있다(브라우저는 MySQL에 직접 접속 불가). 쓰기 API·관리자 CRUD는 Phase 1에선 없음 — **활동 타임라인**(업로드)과 **멤버**(로그인 후 프로필 셀프 편집)는 로그인 기능이 붙는 시점(Phase 2, ~2주 후 예정)에 같이 설계.

**스터디·프로젝트는 백엔드 자체가 필요한지 아직 팀 논의 중** — ROI 관점(개발자가 직접 수정, 프론트 배포 주기(반년)와 데이터 갱신 주기가 일치)에서 "DB+API 없이 프론트 상수로 관리"하는 안이 유력하게 논의되고 있음. 자세한 내용은 §4·§5.

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

- `GET /members` — 파라미터 없음, 전체 멤버 반환. 트랙·기수 필터는 프론트가 클라이언트에서 처리(어떤 `memberships[]` 항목이든 트랙이 일치하면 노출).
- `GET /members/{id}` — `id`는 숫자 PK 또는 GitHub 로그인 슬러그 둘 다 허용(레퍼런스 구현: `String(m.id) === id || m.login === id`)
- **탈퇴자 처리는 이 백엔드가 다루지 않는다** — 탈퇴 시 그냥 DB에서 행을 지우거나 운영진 재량으로 처리. API 계약·유지보수 부담을 줄이기 위해 의도적으로 범위에서 제외(결정).

```json
// 목록 item
{ "id": 26, "login": "yoonjaehong26", "name": "윤재홍", "avatarUrl": null,
  "memberships": [
    { "cohort": 3, "track": "FE", "roles": ["멤버"], "team": "두구두구" },
    { "cohort": 4, "track": "FE", "roles": ["메인테이너", "리드"] }
  ] }
// joinType이 있는 멤버는 목록에도 포함(창립·영입리드 예시는 아래 상세 예시 참고)

// 상세 — 여러 기수에 걸친 멤버 예시(2기 FE → 3기 BE 트랙 전환)
{ "id": 18, "login": "mintcoke123", "name": "강동현", "school": "세종대학교", "avatarUrl": null,
  "memberships": [
    { "cohort": 2, "track": "FE", "roles": ["멤버"], "team": "줍줍" },
    { "cohort": 3, "track": "BE", "roles": ["멤버"], "team": "두구두구" }
  ],
  "bio": null,
  "isPublic": true,
  "summaryCounts": { "completedMissions": 0, "teamProjects": 0, "blogPosts": 0 },
  "completedMissions": [], "blogPosts": [],
  "teamProjects": [], "activities": [] }

// 상세 — 창립멤버 예시(기수/트랙은 정상 보유, department·admissionYear·joinType만 추가)
{ "id": 1, "login": "kokodak", "name": "이승용", "school": "세종대학교",
  "department": ["컴퓨터공학과"], "admissionYear": 20, "joinType": "창립", "avatarUrl": null,
  "memberships": [
    { "cohort": 1, "track": "BE", "roles": ["동아리장", "메인테이너", "리드", "리뷰어"] },
    { "cohort": 2, "track": "BE", "roles": ["동아리장", "메인테이너", "리드", "리뷰어"] },
    { "cohort": 3, "track": "BE", "roles": ["동아리장", "메인테이너"] }
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
- `completedMissions[]`는 `{ missionId, title, cohortLabel, weekLabel }` 형태의 완료 미션 리스트(성취만 노출, 진행중/미완료 제외), `blogPosts[]`는 `{ postId, title, category, relativeDate }` 형태의 글 리스트 — 둘 다 **지금은 MSW 목데이터로만 채워짐**(§9), 실제 조회 계약(미션 백엔드 필터·블로그 도메인)은 여전히 미결(§11-5·§11-6). 목록이 비면 빈 배열.
- `summaryCounts.teamProjects`(숫자)가 `teamProjects[]`(배열) 길이랑 겹치는 건 **필드 유지 + 계산 방식 통일로 결정**(2026-07-10) — 백엔드가 이 숫자를 `teamProjects[].length`와 항상 같게 계산하면 됨, 별도 조치 불필요.
- **미결**: 같은 논리로 `summaryCounts.completedMissions`/`blogPosts`도 `completedMissions.length`/`blogPosts.length`와 중복될 수 있음 — 이 둘은 아직 논의 안 됨, 별도로 정리 필요.
- **완료 미션 중 "진행 중인 미션은 본인에게만, 완료된 것만 공개" 같은 미션 단위 가시성은 이 백엔드 소관이 아님** — 미션 데이터는 별도 Mongo 시스템(`/api/missions`) 소관이라, 그쪽에서 처리할 문제.

**✅ Phase 1.5 — 프론트 프로토타입 목업 (인증 없음, 실제 Spring 계약 아님)**
목업 화면 검증을 위해 `PATCH /members/{id}`와 `isPublic` 토글을 **인증 없이** MSW로 먼저 붙였다(레퍼런스: `src/mocks/handlers/members.ts`). 로그인이 없어 "본인 확인" 없이 누구나 아무 멤버의 bio·공개여부를 바꿀 수 있는 상태 — **Spring 실서버로 갈 때는 반드시 아래 Phase 2 인증이 붙어야 한다.** 지금 계약을 그대로 옮기면:
```json
// PATCH /members/{id} 요청
{ "bio": "마크다운 텍스트", "isPublic": true }
```
둘 다 optional — 보낸 필드만 갱신. 응답은 갱신된 멤버 상세 전체.

**⏳ Phase 2 (인증 필요, 이번 구현 범위 아님)** — 활동타임라인과 같은 시점(로그인 기능, ~2주 후)에 같이 설계:
- 위 `PATCH /members/{id}`에 **로그인한 본인만** 호출 가능하도록 멤버 토큰 미들웨어 추가. **저장은 원본 마크다운 그대로, 렌더링 시 반드시 이스케이프/새니타이징** — 사용자 입력을 그대로 HTML로 그리면 저장형 XSS 위험.
- `isPublic`이 `false`인 멤버는 비로그인 사용자에게 `GET /members/{id}`에서 제외/마스킹하는 규칙 — 지금은 `isPublic` 필드만 있고 실제 가시성 필터링은 없음(누구나 값과 무관하게 전체 조회 가능).

### MySQL
```sql
member       id PK, login UNIQUE, name, school, department JSON NULL, admission_year TINYINT NULL,
             join_type ENUM('창립','영입리드') NULL, avatar_url NULL, bio TEXT NULL,
             is_public BOOLEAN DEFAULT TRUE, created_at
membership   id PK, member_id FK, cohort TINYINT, track ENUM('FE','BE'), team NULL
member_role  membership_id FK, role ENUM('멤버','리뷰어','리드','메인테이너','동아리장','OB')
```

## 4. 프로젝트 (Projects) — ⚠️ 백엔드 필요 여부 미확정

> 디자인이 아직 구체화되지 않아 리뷰 자체를 보류 중. 데이터 변경 주기가 기수(데모데이) 단위라 스터디와 같은 ROI 논리(개발자 직접 수정, 프론트 배포 주기와 일치)가 적용되면 **백엔드 없이 프론트 상수로 관리**하는 쪽에 무게가 있음. 아래 계약은 디자인 확정 전까지의 잠정안.

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

## 5. 스터디 (Study) — ⚠️ 백엔드 필요 여부 미확정 + 필드 재설계 필요

> **페이지 자체가 피벗됨**: 최근 기수부터 `/study`가 "주차별 진행 상황"이 아니라 "최근 기수의 미션 커리큘럼 전체 소개"로 화면이 바뀔 예정(기존 미션 대시보드 스타일 UI는 폐기). 그래도 트랙별로 갈리는 데이터(단계/모듈 목록)라는 본질은 같아서 백엔드 필요성 자체는 유효하지만, **데이터 변경 주기가 기수 단위 + 개발자 직접 수정 + 프론트 배포 주기(반년)와 일치**한다는 ROI 논리로 "백엔드 없이 프론트 상수로 관리"하는 안도 논의 중 — 팀 결정 필요.
>
> 결정과 무관하게, 아래 계약은 **주차(`weekNo`) 전제로 설계된 옛 버전**이라 피벗된 화면(전체 틀 소개)엔 안 맞음. 백엔드로 가기로 하면 `weekNo`/`weekLabel`/`status(DONE·ACTIVE·BREAK)` 대신 "단계/모듈" 기반 필드로 재설계 필요(예: `order`, `label`, 진행상태 개념 자체가 필요한지부터 재검토).

- `GET /curriculum` — 파라미터 없음, **FE·BE 두 트랙 전체 주차를 한 배열로 반환**. 트랙 탭 전환은 프론트가 `track` 필드로 클라이언트에서 필터링(`/study` 아래 다른 하위 리소스가 없어서 `study/` 네임스페이스도 함께 뺐다 — 프론트 페이지 경로(`/study`)와 백엔드 엔드포인트 경로를 굳이 맞출 필요는 없다고 판단)

```json
// ⚠️ 옛 버전(주차 전제) — 재설계 대기
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

- 이 숫자들을 어떻게 산출할지(`member`/`project` 테이블 COUNT로 계산할지, 별도 관리 값으로 둘지)는 **API 계약에 안 드러나는 백엔드 내부 구현 선택** — 프론트는 응답으로 받는 숫자만 그대로 표시한다.
- 홈의 프로젝트 프리뷰 섹션은 `GET /projects` 응답 상위 N개를 그대로 재사용(전용 API 없음).
- **`teamProjects`는 `GET /projects` 목록 길이·멤버 상세 `summaryCounts.teamProjects`와 항상 같은 정의로 계산되어야 한다**(결정, 2026-07-10) — "팀 프로젝트"로 셀 대상(예: 진행중/취소된 프로젝트 포함 여부)이 세 곳에서 어긋나지 않도록 백엔드가 한 곳에서 계산 로직을 공유할 것.

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

- **Phase 1 (완료)**: 멤버·활동타임라인·홈통계 3개 GET 계약(확정) + 프로젝트·스터디 GET 계약(잠정, §4·§5 미확정) + MSW 목서버 + 프론트 데이터 레이어·페이지 연동. 로그인 없음.
- **Phase 1.5 (완료, 프론트 프로토타입)**: member-detail 화면 검증용으로 `PATCH /members/{id}`(bio·isPublic) + 완료미션/기술블로그 리스트를 **인증 없이 MSW 목데이터로만** 먼저 붙임(§3). 실제 백엔드 계약이 아니라 화면 목업 — Spring 전환 시 Phase 2 인증과 §11-5·§11-6 결정을 반드시 거쳐야 함.
- **Phase 2 (~2주 후, 로그인 도입 시)**: 위 `PATCH /members/{id}`에 인증 추가 + 활동 쓰기(업로드) + 멤버 토큰 인증 미들웨어 + 활동·멤버 프로필 공개/비공개 필터링(`isPublic` 기반 실제 마스킹).
- **Phase 3+ (미정)**: 블로그·지원·미션리뷰 도메인 백엔드, Spring 실서버 전환.

## 11. 미결 이슈 (팀 논의 필요 — 체크리스트)

1. **스터디·프로젝트 — 백엔드 자체가 필요한가** (§1·§4·§5): ROI상 프론트 상수 관리가 유력하나 팀 최종 결정 필요.
2. **스터디 필드 재설계** (§5): 화면이 주차별 → 전체 커리큘럼 소개로 피벗됨. 백엔드로 가기로 하면 `weekNo` 기반에서 단계/모듈 기반으로 새로 설계해야 함 — **단, 구체적인 필드 형태는 아직 확정 안 된 화면 디자인에 따라 달라지므로, 디자인이 나온 뒤에 재설계한다.**
3. **활동 디스코드 대량 임포트 방식** (§6): 자동 동기화 vs 수작업 큐레이션. 미션 로스터 선례(하이브리드) 참고 예정, 미결정.
4. **로그인 도입 시 함께 설계할 것** (§3·§6, ~2주 후): 멤버 토큰 미들웨어 방식(토큰 종류), 활동·멤버 프로필 공개/비공개 가시성 규칙, bio 마크다운 XSS 새니타이징.
5. **완료 미션 리스트 — 실제 조회 계약 아직 없음** (§3): `completedMissions[]`는 지금 MSW 목데이터로만 채워져 있고, 실서버에서 이 리스트를 어떻게 채울지 결정 안 됨. `GET /api/missions`(별도 Mongo 미션 백엔드)는 멤버 필터가 없고, PR↔멤버 매칭도 미션 대시보드 전용 로직(`src/features/missions/buildMemberRows.ts`)이라 재사용 불가. (a) 미션 백엔드에 `/api/missions?author=` 필터 추가 vs (b) 멤버 쪽에 `completedMissions[]`를 직접 저장 중 결정 필요.
   - ⚠️ **참고(MVP 범위 아님, 팀 논의 아님)**: "미션 대시보드(`/missions`) 페이지 자체는 없어지고 PR 추적 로직만 Spring 백엔드로 흡수되면 (a)/(b) 고민 자체가 없어진다"는 아이디어가 있으나, 이건 팀 합의가 아니라 이 fork에서 개인적으로 구상해본 것 — MVP 범위 밖이고 확정된 방향 아님.
6. **기술블로그 — 도메인 자체가 없음** (§3·§10): `blogPosts[]`도 지금은 MSW 목데이터. `src/app/blog/*`에 UI 스텁(하드코딩 목데이터, API·DB 없음)은 이미 존재하나 백엔드 도메인은 Phase 3+로 미확정. Phase 3 착수 시 이 스텁을 재사용할지 새로 설계할지 확인 필요.
