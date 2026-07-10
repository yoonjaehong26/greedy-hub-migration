# 미션 대시보드 — 설계 참조 (Mission Dashboard)

> `/missions` 페이지. 기수별·멤버별 미션 진행 현황을 **단계(step) 단위**로 가시화하고, 예외를 QA해 나가는 대시보드.
> 이 문서는 **(a) 기수 확장(2·4·1기)** 과 **(b) 타 사이트 재이식** 을 목표로, 재구현 가능한 수준으로 설계를 정리한다.

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
     login · name · withdrawn? · memberships[]{cohort,track,role,team}
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

**남은 과제 — 4기**: 14주. 룰렛(`javascript-greedy-roulette`)·좀비(`javascript-zombie-survival`)·`react-whatever-you-want`·`react-pokemon-ssr` 추가 필요(FE 커리큘럼 다름). BE 인원 많음. 미착수.

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

> 전 기수 🔴 진짜 누락 총 6건: 김태우(3기 방탈출②MVC) · 박예은·배강현(탈퇴, React) · 황승준·김의진·남해윤(1기 방탈출②JPA·Core).

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
