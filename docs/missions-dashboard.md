# 미션 대시보드 — 설계 참조 (Mission Dashboard)

> `/missions` 페이지. 기수별·멤버별 미션 진행 현황을 **단계(step) 단위**로 가시화하고, 예외를 QA해 나가는 대시보드.
> 이 문서는 **(a) 기수 확장(1·2·3·4기 완료)** · **(b) 타 사이트 재이식** · **(c) 5기+ 자동화 전환**을 목표로, 재구현 가능한 수준으로 설계를 정리한다.
> 하드코딩 경계와 자동화 주의점은 **§10**을 볼 것.

## 1. 목적 & 범위

- **목표 1 — 미션 소개 한곳에**: 각 미션의 README 링크를 카탈로그에 보관 (`introUrl`).
- **목표 2 — 멤버별 PR·완주 현황 한곳에**: GitHub PR을 명부에 맞춰 자동 집계.
- **파일럿 = 3기(2025-2)**. 확장 순서: **3·2·1기 완료 → 4기 남음**.
  - 화면에서 기수 토글로 전환 (`availableCohorts()`가 카탈로그 있는 기수를 자동 노출).

## 2. 핵심 원칙 (왜 단순 자동화가 안 되는가)

노션 분석 결론: **"깃허브 토큰 순수 자동화보다 DB로 하드하게 정리"**. 이유:

1. **기수마다 커리큘럼이 다름** — 1·2·3기 ≈ 11주, 4기 = 14주. 단일 열 배열로 표현 불가 → **기수별 카탈로그**.
2. **한 사람이 기수·트랙을 갈아탐** — 강동현 2기 FE → 3기 BE. GitHub login만으론 못 가름 → **명부 + 날짜창**.
3. **미션 레포가 공용** — FE 심화·BE nextstep 레포엔 2·3·4기 + 비회원 수백 명 PR이 섞임 → **명부로 귀속(attribution)**.
4. **PR 1개 ≠ 미션 1개** — 한 PR이 여러 단계를 묶고("1,2,3단계"), 재제출·closed·테스트 PR 섞임 → **단계 단위 집계 + 오버라이드**.

→ 그래서 **하이브리드**: 큐레이션된 명부/카탈로그(정답) + GitHub sync(후보 PR 공급) + 오버라이드(수동 교정).

## 3. 데이터 모델 (3계층 + PR)

```
① Member (명부, 큐레이션)          src/shared/core/constants/members.ts
     login · name · withdrawn? · memberships[]{cohort,track,role,team} · note?
     └ 한 사람이 여러 기수 = memberships 배열로 자연 해결

② MissionCatalog (기수·트랙별)      src/shared/core/constants/missionCatalog.ts
     cohort · track · order · label · repository · units[]{id,label} · introUrl
     └ 완주 판정 단위 = units (레포가 아님)

③ PROverride (수동 교정)           src/shared/core/constants/prOverrides.ts
     missionId · status(include|exclude) · reassignCohort? · note
     └ 테스트/오작성 PR 제외, 기수 재지정

④ Mission = 실제 PR (sync가 채움)   src/shared/core/types/mission.ts + missionsRepo.ts
     id(`repo#pr`) · author · state(open|merged|closed) · repository · createdAt …
```

**Cohort 날짜창** (`src/shared/core/constants/cohorts.ts`): 기수별 `startDate~endDate`. cross-cohort 멤버의 PR을 `createdAt`으로 가른다.

## 4. 귀속 3원칙 (attribution)

`buildMemberRows(missions, cohort, track)` — [src/features/missions/buildMemberRows.ts](../src/features/missions/buildMemberRows.ts)

PR이 특정 (기수, 트랙, 멤버)에 귀속되는 조건:

1. **명부**: author(소문자)가 그 기수·트랙 명부에 있어야 함. 없으면 "명부밖"(요약 카운트만, 개별 큐 X).
2. **작성자**: PR `author`(= `user.login`) 기준. 리뷰어 login은 세지 않음.
3. **날짜창**: PR `createdAt`이 기수 `startDate~endDate` 안. (cross-cohort 분리)
4. **오버라이드**: `exclude`면 제외, `reassignCohort`면 해당 기수에만.

## 5. 단계 집계 & 셀 상태 (PR ≠ 미션)

미션 하나 = `units[]` (단계/페이즈). 완주 = **전 units 머지**.

### 5.1 제목 → 단계 매핑: `matchUnits(repository, title)`

제목 규칙이 멤버마다 제각각이라 **단계번호 + 페이즈 키워드**를 함께 인식:

| 레포 | units | 인식 규칙 (예시 제목) |
|---|---|---|
| baseball | w1, w2 | `1주차` / `2주차`·`MVC` |
| self-paced-react | 1~5 | `N단계` (`[1단계미션]`, `[3,4단계미션]`) |
| self-paced-react-advanced | 1, 2.1, 2.2, 2.3 | `adv-N` / `2.1`·`Context` / `2.2`·`Zustand` / `2.3`·`Tanstack` |
| react-spa-routing | 1 | PR 존재 시 완료 (단일) |
| react-todo-list | 1, 2 | `step1` / `step2` (영문) |
| racingcar / lotto | 1~4 / 1~5 | `N단계` |
| ladder (사다리) | 1 | PR 존재 시 완료 (단일 제출) |
| spring-roomescape (방탈출①) | mvc, jdbc, core | `[Spring MVC]` / `[Spring JDBC]` / `[Spring Core]` (페이즈명 명시) |
| spring-basic-roomescape (방탈출②) | mvc, jpa, core | `MVC`·`인증`·1-3 / `JPA`·4-6 / `Core`·`배포`·7-9 |

> ⚠️ **방탈출은 두 라운드**: ①(spring-roomescape, 6~9주차, JDBC) → ②(spring-basic-roomescape, 11~14주차, JPA). 같은 nextstep 레포를 2·3기가 공용하므로 날짜창으로 기수 분리.

- 한 PR이 여러 units 커버 가능 (`"1,2,3 단계"` → 3개).
- 매칭 실패 PR = **매핑불명**(빨강, QA 대상). 실데이터 912건·3기 10명 기준 매핑불명 0건.
- ⚠️ 규칙은 큐레이션이며 새 표기가 나오면 매핑불명으로 뜬다 → `matchUnits`에 규칙 추가 or `prOverrides`로 확정.

### 5.2 단계 상태 & 미션 셀 상태 — QA 색 구분

**단계(unit) 상태 4종:**
| 상태 | 색 | 의미 |
|---|---|---|
| `merged` | 🟢 초록 | 머지됨 (완료) |
| `submitted` | 🟡 노랑 | open PR 있음 (미머지) |
| `closed` | ⬜ 취소선 | 닫힌 PR만 있음 (**제출했으나 머지 못 받음** — "누락"과 구분!) |
| `none` | ⚪ 연회색 | 어떤 PR도 없음 (진짜 미제출) |

**미션 셀(mission) 상태 4종:**
| 상태 | 색 | 의미 | 조치 |
|---|---|---|---|
| `done` | 🟢 초록 | 전 단계 머지 | 완주 |
| `pending` | 🟡 노랑 | 미완 단계가 **전부 제출됨**(open 또는 closed) | 머지/재오픈만 하면 됨 |
| `gap` | 🔴 빨강 | 미완 단계 중 **PR이 아예 없음**(닫힘조차 없음) | 진짜 미제출 (본인 확인) |
| `none` | ⚪ 회색 | 제출 PR 없음 | 미착수 |

이 `pending`/`gap` 구분이 QA의 핵심: "제출은 했으나 미완"과 "진짜 미제출"을 가른다. `gap` 셀에서는 원인 단계(`none`)만 펼침 상세에서 빨강으로 표시.

### 5.3 닫힌(closed) PR 처리 — 재제출 vs 진짜 제출
GitHub상 머지된 PR은 `merged`로 따로 잡히므로 `closed`는 항상 미머지다. 단, **두 종류로 갈린다** (1기 재조사에서 정립):
- **재제출/실수** — 닫힌 PR이 덮는 단계가 이미 merged/open으로 커버됨(예: 3기 실수 close 후 재제출). → **숨김**, 미션별 `닫힌 N건 숨김`만 표기.
- **진짜 제출(닫힘)** — 닫힌 PR이 그 단계의 **유일한 PR**임(예: 1기 방탈출을 제출했으나 학기 종료로 머지 못 받고 닫힘). → 단계 상태 `closed`로 **표시**. "누락(gap)"으로 오집계하지 않음.

⚠️ 이 구분이 없으면 1기 BE처럼 "제출은 했는데 닫힌" 케이스가 전부 🔴 누락으로 잡혀 과대 집계된다(재조사 사유).

**세 번째 경우 — 불참/부정행위(override 필수)**: 닫힌 PR 중 **AI 사용·규정 위반으로 불참 처리**된 것이 섞일 수 있다(예: 4기 천동현 styled #59). GitHub `closed`엔 이유가 없어 시스템은 이걸 "닫힘(제출)"로 오분류한다 → **`prOverrides`에 `status:'exclude'` + note로 수동 확정**하면, 해당 PR은 집계 제외되고 UI에 `🚫 불참 처리: <이유>`로 표기된다(단계는 미제출로 처리, 완주 수 영향 없음).
- **QA 방법**: "닫힘(제출)"로 표시된 케이스(= 단계의 유일 PR이 closed)를 주기적으로 훑어 불참 여부 확인. 1~4기 전체에 9건 있었고(1기 학기말 미완 8 + 천동현 불참 1), 이 중 불참만 override에 추가.

## 6. 파일 지도

| 역할 | 파일 |
|---|---|
| 타입 | `src/shared/core/types/roster.ts`, `types/mission.ts` |
| 명부 | `src/shared/core/constants/members.ts` |
| 기수 날짜창 | `src/shared/core/constants/cohorts.ts` |
| 카탈로그 + 파서 | `src/shared/core/constants/missionCatalog.ts` |
| 오버라이드 | `src/shared/core/constants/prOverrides.ts` |
| 집계 로직 (순수) | `src/features/missions/buildMemberRows.ts` |
| UI (멤버 중심) | `src/features/missions/MemberMissionList.tsx` |
| 페이지 | `src/app/missions/page.tsx` |
| 동기화 | `src/app/api/missions/sync/route.ts`, `shared/lib/github/githubApi.ts` |
| 추적 레포 시드 | `src/shared/lib/db/trackedReposRepo.ts` (`SEED_REPOS`) |

## 7. 기수 확장 플레이북 (1·2·3기 완료 → 4기 남음)

새 기수 N을 추가하려면 **상수만** 편집 (로직·UI 불변):

1. **명부** (`members.ts`): 기수 N 신입기수 멤버 추가. cross-cohort면 기존 멤버의 `memberships[]`에 항목 추가(파일 병합).
2. **날짜창** (`cohorts.ts`): 기수 N의 `startDate~endDate` 확인 (이미 1~4기 정의됨).
3. **카탈로그** (`missionCatalog.ts`): 기수 N의 FE/BE 미션 + `units` + `introUrl`. 커리큘럼이 3기와 다르면(4기 룰렛·좀비·whatever·pokemon 등) 새 units/레포 정의.
4. **파서** (`matchUnits`): 새 레포의 제목 규칙 추가 (해당 레포 PR 제목을 먼저 조사).
5. **추적 레포** (`trackedReposRepo.ts` `SEED_REPOS`): 기수 N 레포 추가 후 sync.
6. **UI**: 기수 선택 축만 열면 됨 (현재 `PILOT_COHORT` 고정 → 드롭다운으로 확장).

**검증 원칙 (1기에서 정립)**: 명부 항목(특히 "PR 안 보임" 판정)은 **두 경로로 교차검증**한다 — GitHub Search API(`search/issues?q=author:X+org:Y`)는 인덱싱 지연·누락이 있어 단독으로 신뢰하면 안 됨(황승준·김의진·정상희를 "미확인"으로 오판했던 사례). 최종 판단은 **동기화된 Mongo 데이터**(`/api/missions` 전량)로 재확인.

**4기 (완료 · 진행 중 기수)**: FE 커리큘럼이 1~3기와 **다름** → `cohort4FE()` 별도 함수로 분리(`sharedFE123`과 구분). 차이점:
- 숫자야구 **1주만**(1~3기는 2주 w1/w2) · 룰렛·좀비 추가(각 단일 제출) · SPA/Todo 대신 **무엇이든(3step)·포켓몬SSR(2주)**.
- self-paced·advanced·BE 5종은 1~3기와 동일(파서 재사용).
- ⚠️ **whatever·pokemon은 착수 전**이라 실제 제출 제목 미확정 → 파서는 step/단계/주차 다각 인식으로 잠정 작성. **멤버 제출 들어오면 제목 확인 후 보정**(들어오면 `매핑불명`으로 뜸).
- 진행 중이므로 `COHORTS[4].ongoing=true` → UI에 "진행 중" 배너. 뒤쪽 미션 ⚪/🔴는 "아직 안 함"(정상), 완주 판정은 종료 후.
- spring-roomescape 파서에 **단계번호 폴백** 추가(4기 일부가 JDBC를 "Spring MVC 5,6,7단계"로 오라벨).

**1기 확장에서 배운 것 (완료, §8 참조)**:
- 야구 레포는 삭제되지 않고 실존 — 1기 PR도 정상 존재(노션 메모는 오래된 추정이었음).
- BE racingcar·lotto는 **단계 분할 없이 PR 1건으로 통짜 제출**("[N주차]" 또는 무표기) → `matchUnits`에 "단계 매칭 실패 시 전 단계 완료" 폴백 추가로 해결.
- React 심화 일부 PR이 "2.1" 대신 **"2(1)" 괄호 표기** 사용 → 정규식에 패턴 추가.
- 방탈출②(마지막 미션)가 학기 종료 시점과 겹쳐 **완주율이 구조적으로 낮음**(closed·미제출 다수) — 파서 버그 아님, 실제 데이터.
- 정창우(ChangwooJ)는 노션엔 "1기 모꼬지"로 기재됐으나 실PR은 전부 2기 창에만 존재 → **1기 이력 제거**, 2기 전담으로 정정.
- 탈퇴 멤버(박예은 `ye6194`, 배강현 `bae-kh`)는 실제 PR 이력 있음(팀 미상) → `withdrawn:true`로 명부에 유지, 통계는 그대로 노출.
- 노션 데모팀 명부에 있던 5명 중 **2명(신혁수 `sins051301`, 방재경 `Jae-kyoung`)은 이중 교차검증으로 PR 0건 확인** — 미션 미참여로 추정, 명부엔 QA 대기로 유지.

## 8. QA 현황 (실데이터 검증 기준)

> BE는 5미션·16단계 기준 (자동차4 + 로또5 + 사다리1 + 방탈출①3 + 방탈출②3).

### 3기
- **완주**: 윤재홍·강건·강예령(FE 14/14), 하수한·김하늘(BE **16/16**)
- **BE 미완**: 김태우 15/16(방탈출② MVC 🔴누락) · 강동현 14/16 · 이고은 13/16(로또3-5) · 서현진 11/16(로또·방탈출②)
- **FE 🟡 머지만 하면 됨**: 심혁 Todo step2(#25)
- **🔴 진짜 누락(gap)**: **김태우 방탈출②(spring-basic) MVC** — PR 없음. 본인 확인 필요.
- **확정 사항**: `ke-62` = 이고은(기념비 기준) · `mintcoke123` 강동현 = 2기 FE→3기 BE(2기 PR 날짜창 자동 제외).

### 2기 (특이 예외 없음)
- **완주**: FE 6명 전원(14/14) · BE 허석준·염지환·이창희·전서희(**16/16**)
- **🟡 머지만 하면 됨**: 김지우 사다리(미머지) · 황혜림 방탈출② Core 배포(#176) — 각 15/16
- **🔴 진짜 누락**: 없음
- **cross-cohort 플래그(정상)**: `developowl`(신지훈) 1기 BE→2기 FE 전환 · `mintcoke123`(강동현) 2기 FE / 3기 BE.
- **명부 정리**: 남해윤(haeyoon1)은 2기 줍줍 데모팀 명단엔 있으나 미션 수행은 1기 창 → **2기 명부에서 제외**(1기로 편입 완료). `ChangwooJ`(정창우)는 1기 이력 오기재였음 → 2기 전담으로 정정(§7 참조).

### 1기 (예외 최다 — 완료)
- **FE 완주**: 송혜정(Songhyejeong)·김준수(gogo1414) 전원 **14/14**
- **BE**: 방탈출은 대부분 🟡 **제출·미머지**(닫힌 PR = 학기 종료로 머지 못 받은 진짜 제출). 완주 집계는 낮으나 "미제출"은 아님.
  - 🔴 **진짜 누락(PR 아예 없음)은 3명뿐**: 황승준·김의진·남해윤의 **방탈출② JPA·Core** — round1은 다 하고 round2는 MVC만 제출 후 중단(학기 종료). 이건 closed조차 없는 진짜 미제출.
  - ⚠️ **1기 재조사 계기**: 최초엔 닫힌 PR을 "PR 없음"으로 처리해 1기 BE 누락이 과대 집계됐음. §5.3의 "재제출 vs 진짜 제출" 구분 도입으로 신혜빈·정상희·안금서 등의 닫힌 제출이 `closed`(제출·미머지)로 정상 분류됨.
- **탈퇴 멤버 참고 통계**: 박예은(ye6194) React심화 도중 중단 · 배강현(bae-kh) 숫자야구만. 둘 다 `withdrawn:true` 플래그.
- **명부에 있으나 PR 0건**: 신혁수(sins051301)·방재경(Jae-kyoung) — 이중 교차검증(Search API + 전체 동기화) 후에도 미확인. 미션 미참여로 추정.
- **오탐 정정**: 황승준·김의진·정상희를 최초엔 "미션 PR 미확인"으로 잘못 분류했었음(Search API 인덱싱 누락) → 전체 동기화 데이터 재검증으로 정상 참여 확인.
- **파서 추가**: racingcar·lotto "전 단계 통짜 제출" 폴백, advanced "2(1)" 괄호 표기 인식.

> 전 기수(1·2·3기 종료) 🔴 진짜 누락 총 6건: 김태우(3기 방탈출②MVC) · 박예은·배강현(탈퇴, React) · 황승준·김의진·남해윤(1기 방탈출②JPA·Core).

### 4기 (진행 중 — 완주 판정 보류)
- **FE (17단계, ~10주차)**: 4명 전원 숫자야구·룰렛·좀비·React기초 완주, 심화 TanStack 미머지(9주차 방금), 무엇이든·포켓몬 미착수(⚪, 정상). 매핑불명 0.
- **BE (16단계)**: 정명준·김하은 14/16, 강대현·이태규·이채현 13/16, 김민욱 7/16(자동차·로또·사다리 전부 미머지 — 리뷰 대기). 방탈출②(round2) JPA·Core는 대부분 아직 미착수(🔴이지만 "진행 중"이라 정상).
- ⏳ **주의**: 진행 중 기수라 뒤쪽 미션의 ⚪/🔴는 "실패"가 아니라 "아직 안 함". 종료 후 재판정.

## 9. 타 사이트 재이식 가이드

**이식 = "순수 로직/데이터는 그대로, 어댑터만 교체"**.

| 계층 | 포터빌리티 | 재이식 시 |
|---|---|---|
| `roster.ts` 타입, `members`·`cohorts`·`missionCatalog`·`prOverrides` 상수 | ✅ 프레임워크 무관 (순수 데이터/JS) | **그대로 복사** |
| `matchUnits`, `buildMemberRows`, `outsiderSummary` | ✅ 순수 함수 (입력=PR 배열) | **그대로 복사** |
| `githubApi.fetchRepoPRs` | 🟡 `fetch`만 사용 | 토큰 주입부만 조정 |
| sync 라우트 / `missionsRepo`(Mongo) | 🔴 Next API + MongoDB | 대상 사이트의 API·DB로 교체 |
| `MemberMissionList.tsx` | 🔴 React + Tailwind + TanStack Query | 대상 UI 프레임워크로 재작성 (상태 4색·단계 뱃지 스펙은 §5.2 참조) |
| `missionQueries`(TanStack) | 🔴 | 대상 데이터 페칭으로 교체 |

**핵심**: 집계 정확성을 좌우하는 `matchUnits` + `buildMemberRows` + 상수 4종은 **의존성 없는 순수 계층**이라 어느 스택에도 그대로 옮겨진다. sync/DB/UI만 어댑터.

## 10. 하드코딩 경계 & 자동화 전환 가이드 (4·5기+)

### 10.1 무엇이 "하드"(사람 큐레이션)이고 무엇이 자동인가

1·2·3기는 **3계층으로 나뉜다**:

| 구분 | 무엇 | 소스 | 자동화 가능? |
|---|---|---|---|
| **① 정답표 (하드코딩)** | 명부(누가 몇기·트랙·팀·탈퇴) · 카탈로그(레포·단계 정의·소개링크) · 파서 규칙(제목→단계) · 오버라이드 | TS 상수 4종 (사람이 큐레이션, git 버전관리) | ❌ **불가** — GitHub이 "3기 BE 밋링크"를 알려주지 않음 |
| **② 원본 사실 (자동)** | PR 작성자·제목·상태·날짜·URL | GitHub sync → MongoDB `missions` | ✅ 이미 자동 |
| **③ 산출 (순수 계산)** | 멤버별 단계 현황·완주율·gap/pending | `buildMemberRows` (①+② 결합) | ✅ 이미 자동 |

> **결론**: "DB로 하드하게"의 실체 = **①만 사람이 채운다.** ②③은 자동. 즉 새 기수마다 사람이 하는 일은 딱 **명부·카탈로그·파서 규칙 입력**뿐. 이게 자동화의 하한선(GitHub으로 대체 불가한 부분).

### 10.2 자동화 주의점 — 트러블슈팅에서 도출한 함정 목록

**A. 데이터 소스 함정**
1. **공용 레포 = 귀속 필수**: nextstep·cho-log 레포엔 전 기수+비회원 수백 명 PR이 섞임. "레포의 모든 PR = 우리 미션"은 틀림 → 명부+작성자+날짜창 필터 필수.
2. **작성자만 집계**: 우리 멤버가 남의 PR 리뷰어로 대량 등장(하수한 리뷰 168회). `user.login`(작성자)만 세고 리뷰어 무시.
3. **merged ≠ state**: GitHub은 머지된 PR도 `state:closed`. **`merged_at` 유무로 판정**해야 함(`githubApi.ts`가 이미 처리).
4. **Search API 신뢰 금지**: `search/issues` API는 인덱싱 지연·누락 있음. 황승준·김의진 등을 "PR 0건"으로 오판했던 원인. **최종 판단은 항상 전체 동기화 데이터(`/api/missions`)로 재확인.** 인증 토큰 필수(무인증 60/hr, 인증 5000/hr).

**B. 매핑·파싱 함정**
5. **PR ≠ 미션 ≠ 단계**: 한 PR이 여러 단계 묶고("1,2,3단계"), 한 미션에 여러 단계. **PR 개수로 세면 틀림** → 단계 단위 매핑.
6. **제목 형식 카오스**: 기수·개인마다 5+종(단계번호 / `[N주차]` / `stepN` / `adv-2.1` / `adv-2(1)` 괄호 / 페이즈명 `[Spring JDBC]`). 순수 정규식 파싱은 깨짐. 레포별 큐레이션 규칙 + 폴백 + `매핑불명`으로 QA 노출. **파서는 새 기수마다 실제 제목을 먼저 조사하고 추가**해야 함.
7. **closed 이분법**: 닫힌 PR = 재제출/실수(숨김) vs 학기말 진짜 제출(표시). "그 단계의 유일한 PR인가"로 구분(§5.3). 이거 없으면 누락 과대집계.
8. **기수별 커리큘럼 상이**: 1~3기 11주(동일), 4기 14주(룰렛·좀비·whatever·pokemon = 다른 레포). BE도 레포 5개(사다리·방탈출 2라운드) — **처음엔 3개인 줄 알았다가 실멤버 PR 역추적으로 5개 발견.** 새 기수는 카탈로그를 실데이터로 검증.

**C. 명부 함정**
9. **노션/데모팀 명부 ≠ 실제 참여자**: 명부에만 있고 PR 0건(신혁수·방재경) · 기수 오기재(정창우 노션 1기지만 실제 2기) · 데모팀은 A기수인데 미션은 B기수(남해윤) · 이름 모호(ke-62 이고은/김고은) · 탈퇴자도 PR 이력 있음(박예은·배강현). → **명부는 사람이 실PR과 대조해 확정.** GitHub만으로 못 만듦.
10. **cross-cohort**: 같은 login이 여러 기수·트랙(강동현 2기FE→3기BE, 신지훈 1기BE→2기FE). **날짜창으로 분리** 필수.
11. **login 대소문자**: `Johncakes`=`johncakes`. 소문자 정규화.
12. **테스트·노이즈 PR**: `test`·`r`·`g`·"머지 테스트"·엉뚱한 레포에 오제출. 대개 closed라 걸러지나, 아니면 오버라이드.

**D. 해석 함정**
13. **학기말 미완은 정상**: 마지막 미션(방탈출②)은 구조적으로 완주율 낮음(1기). 버그 아님. **진행 중 기수는 미머지가 자연스러움** — 종료 기수와 다르게 해석.

### 10.3 4기 vs 5기+ 전략

- **4기**: 이미 진행됐거나 진행 중 → 1~3기와 같은 방식. **명부·카탈로그·파서를 사람이 큐레이션**하고 sync+집계는 자동. (커리큘럼이 다르니 카탈로그·파서 신규 작성 필요.)
- **5기+**: "완전 자동화"의 핵심은 **입력 표준화**다. GitHub이 못 주는 ①(명부·카탈로그)을 사람이 채우는 건 불가피하지만, 아래를 강제하면 파서·귀속이 거의 무료가 된다:
  1. **PR 제목 템플릿 강제**(예: `[<미션> <N단계>] <이름>`) → 파서가 신뢰 가능해짐(§10.2-6 해소).
  2. **GitHub Team/Label로 기수·트랙 태깅** → 귀속이 명부 없이도 가능해짐(§10.2-1,9 완화).
  3. **신입 셀프 등록 폼**(기수·트랙·팀·login) → 명부 ①을 반자동화.
  4. 회원 전용 미션 레포(비회원 격리) → 공용 레포 노이즈 제거.
  - 표준화 없이는 5기도 결국 4기와 같은 수작업. **"자동화 vs 수작업"의 갈림길은 코드가 아니라 입력 규약**이다.

---

## 관련 문서
- 미션 커리큘럼 상세: [missions.md](./missions.md)
- 결정 기록: [decisions.md](./decisions.md) (미션 대시보드 섹션)
- 레이어 규칙: [architecture.md](./architecture.md)
