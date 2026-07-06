# 미션 대시보드 — 설계 참조 (Mission Dashboard)

> `/missions` 페이지. 기수별·멤버별 미션 진행 현황을 **단계(step) 단위**로 가시화하고, 예외를 QA해 나가는 대시보드.
> 이 문서는 **(a) 기수 확장(2·4·1기)** 과 **(b) 타 사이트 재이식** 을 목표로, 재구현 가능한 수준으로 설계를 정리한다.

## 1. 목적 & 범위

- **목표 1 — 미션 소개 한곳에**: 각 미션의 README 링크를 카탈로그에 보관 (`introUrl`).
- **목표 2 — 멤버별 PR·완주 현황 한곳에**: GitHub PR을 명부에 맞춰 자동 집계.
- **파일럿 = 3기(2025-2)**. 확장 순서: **3기(완료) → 2기 → 4기 → 1기**.
  - 1기를 마지막에 두는 이유: 레포 삭제(야구)·탈퇴 멤버·기수 중복 등 예외가 가장 많음.

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
| roomescape | mvc, jpa, core | `MVC`·`인증`·1-3 / `JPA`·4-6 / `Core`·`배포`·7-9 |

- 한 PR이 여러 units 커버 가능 (`"1,2,3 단계"` → 3개).
- 매칭 실패 PR = **매핑불명**(빨강, QA 대상). 실데이터 912건·3기 10명 기준 매핑불명 0건.
- ⚠️ 규칙은 큐레이션이며 새 표기가 나오면 매핑불명으로 뜬다 → `matchUnits`에 규칙 추가 or `prOverrides`로 확정.

### 5.2 미션 셀 상태 (4단계) — QA 색 구분

| 상태 | 색 | 의미 | 조치 |
|---|---|---|---|
| `done` | 🟢 초록 | 전 단계 머지 | 완주 |
| `pending` | 🟡 노랑 | 미완 단계가 **전부 open PR 보유** | **머지만 하면 됨** |
| `gap` | 🔴 빨강 | 미완 단계 중 **PR 자체가 없음** | 머지로 해결 안 됨 (본인 확인) |
| `none` | ⚪ 회색 | 제출 PR 없음 | 미착수 |

이 `pending`/`gap` 구분이 QA의 핵심: "머지 대기"와 "진짜 누락"을 색으로 가른다.

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

## 7. 기수 확장 플레이북 (2 → 4 → 1기)

새 기수 N을 추가하려면 **상수만** 편집 (로직·UI 불변):

1. **명부** (`members.ts`): 기수 N 신입기수 멤버 추가. cross-cohort면 기존 멤버의 `memberships[]`에 항목 추가(파일 병합).
2. **날짜창** (`cohorts.ts`): 기수 N의 `startDate~endDate` 확인 (이미 1~4기 정의됨).
3. **카탈로그** (`missionCatalog.ts`): 기수 N의 FE/BE 미션 + `units` + `introUrl`. 커리큘럼이 3기와 다르면(4기 룰렛·좀비·whatever·pokemon 등) 새 units/레포 정의.
4. **파서** (`matchUnits`): 새 레포의 제목 규칙 추가 (해당 레포 PR 제목을 먼저 조사).
5. **추적 레포** (`trackedReposRepo.ts` `SEED_REPOS`): 기수 N 레포 추가 후 sync.
6. **UI**: 기수 선택 축만 열면 됨 (현재 `PILOT_COHORT` 고정 → 드롭다운으로 확장).

**기수별 주의점**
- **4기**: 14주. 룰렛(`javascript-greedy-roulette`)·좀비(`javascript-zombie-survival`)·`react-whatever-you-want`·`react-pokemon-ssr` 추가. BE는 인원 많음.
- **2기**: 강동현·신지훈 등 cross-cohort. 날짜창(2025-1)으로 3기와 분리.
- **1기**: ⚠️ 야구 레포(`javascript-baseball-precourse`) **1기 버전 삭제됨**. 탈퇴 멤버(박예은 `ye6194`, 배강현 `bae-kh`)는 `withdrawn:true`. spa-routing·todo-list 대신 다른 초기 레포 가능성 → 레포 재확인 필요.

## 8. 3기 QA 현황 (2026-01 기준 데이터)

- **완주**: 윤재홍·강건·강예령(FE 14/14), 하수한·김하늘(BE 12/12)
- **🟡 머지만 하면 됨(pending)**: 심혁 Todo step2(#25) · 강동현 방탈출 JPA(#210,#201) · 이고은 로또 3-5(#144) · 서현진 로또 3-5(#145)·방탈출 JPA/Core(#200,#209,#211)
- **🔴 진짜 누락(gap)**: **김태우 방탈출 MVC(1-3)** — PR 없음. 본인 확인 필요.
- **확정 사항**: `ke-62` = 이고은(기념비 기준) · `mintcoke123` 강동현 = 2기 FE→3기 BE(2기 PR 날짜창 자동 제외).

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

---

## 관련 문서
- 미션 커리큘럼 상세: [missions.md](./missions.md)
- 결정 기록: [decisions.md](./decisions.md) (미션 대시보드 섹션)
- 레이어 규칙: [architecture.md](./architecture.md)
