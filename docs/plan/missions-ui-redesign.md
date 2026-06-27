# /missions UI 재설계 계획서

> 목표: 난잡한 미션 대시보드를 `prototype/`의 디자인 패턴(특히 `missions.html` · `admin.html`)에 맞춰
> "화면당 주인공 하나" 원칙으로 재정렬한다. 데이터(조직 전체 PR 집계)와 커리큘럼 문서(`docs/missions.md`)의
> 성격을 반영한다.

## 1. 진단

### 1.1 프로토타입의 레시피 (변하지 않는 뼈대)
`missions.html`, `admin.html` 모두 동일한 구조를 따른다:

1. **헤더** — `h1(text-2xl md:text-3xl font-bold)` + 역할 배지 + 한 줄 설명(`text-slate-600 dark:text-slate-400`)
2. **4-up 스탯 스트립** — `grid grid-cols-2 sm:grid-cols-4 gap-4`, 카드 `p-5`,
   라벨 `text-sm text-slate-500` + 값 `text-3xl font-bold` (의미별 색: 진행=brand, 완료=emerald-600, 임박=amber-500)
3. **단 하나의 주력 surface** — 분할 리스트 카드(`missions.html`) 또는 매트릭스 테이블(`admin.html`).
   섹션 제목은 `h2(text-lg font-semibold)`.
4. **조용한 보조 요소** — 푸터 링크 / 헬퍼 텍스트(`text-xs text-slate-400`)

### 1.2 현재 구현의 문제
- 무게가 같은 surface 5개(SummaryCards·MemberStats·RepoStats·RecentActivity·MissionList)를 세로로 쌓아 **초점이 없음**.
- 스탯 카드 토큰 어긋남: `text-2xl`/`gap-3`/`px-5 py-4` → 프로토타입은 `text-3xl`/`gap-4`/`p-5`.
- emerald 음영 3종 혼용(500/600/700), SyncButton은 카드와 다른 라운드/링 두께.
- 데이터 성격(전체 집계)은 `admin.html`의 **멤버 × 미션 매트릭스**와 정확히 대응되는데 그 패턴 미사용.

## 2. 설계 방향

### 2.1 핵심 결정 — 주력 surface = 멤버 × 미션 매트릭스 ✅ 확정
데이터(멤버별 · 레포별 PR)와 문서(`docs/missions.md`)를 곱하면 자연스럽게
`admin.html` 매트릭스가 된다. 이것을 **유일한 주력 surface**로 삼는다.

- **행** = 멤버(PR author), **열** = **주차(14주 단위)** ✅, **셀** = 상태
  - `머지됨` → `bg-emerald-500` (done)
  - `오픈(리뷰 중)` → `bg-brand` (review)
  - `미제출` → `bg-slate-300 dark:bg-white/20` (none)
- 마지막 열 = 개인 완주율(머지 수 / 진행 미션 수). 셀/행 hover는 `admin.html` 그대로.

#### 2.1.1 14주 열 정의 (`docs/missions.md` 기반)
| 주 | 라벨 | 레포 | step 마커 |
|---|---|---|---|
| 1 | 숫자야구 | `javascript-baseball-precourse` | (단일) |
| 2 | 룰렛 | `javascript-greedy-roulette` | (단일) |
| 3 | 좀비 | `javascript-zombie-survival` | (단일) |
| 4 | React기초 ①~③ | `cho-log/self-paced-react` | step 1~3 |
| 5 | React기초 ④~⑤ | `cho-log/self-paced-react` | step 4~5 |
| 6 | 심화 ① | `self-paced-react-advanced` | step 1 |
| 7 | 심화 ②-1 | `self-paced-react-advanced` | step 2-1 |
| 8 | 심화 ②-2 | `self-paced-react-advanced` | step 2-2 |
| 9 | 심화 ②-3 | `self-paced-react-advanced` | step 2-3 |
| 10 | 자유 ① | `react-whatever-you-want` | step 1 |
| 11 | 자유 ② | `react-whatever-you-want` | step 2 |
| 12 | 자유 ③ | `react-whatever-you-want` | step 3 |
| 13~14 | SSR | `react-pokemon-ssr` | (단일, 2주 병합 셀) |

#### 2.1.2 PR → 주차 매핑 전략 (14주 선택의 핵심 과제)
GitHub PR에는 주차 메타데이터가 없고 `repository + title + author`만 있다.
- **단일 레포(1·2·3·13~14주)**: repo만으로 주차 확정.
- **다주차 레포(4~5, 6~9, 10~12주)**: PR 제목/브랜치명에서 step 마커를 정규식으로 추출
  (`step\s*([0-9]+(?:[-.][0-9]+)?)`, `adv-2.1`, `[2-3]` 등 실제 PR 네이밍 확인 후 확정).
- **폴백**: step 파싱 실패 시 해당 레포의 **첫 주차**로 귀속하고, 매트릭스 하단 헬퍼 텍스트에
  "step 미상 N건은 첫 주차로 집계" 명시(`text-xs text-slate-400`). 절대 조용히 누락하지 않는다.
- **셀 상태 집계**: (author, week)에 매칭되는 PR 중 최선 상태 채택(merged > open > none).
- ⚠️ **리스크**: 실제 PR 제목 컨벤션이 일정치 않으면 매핑 정확도가 떨어진다.
  구현 1단계에서 실제 PR 제목 샘플을 먼저 확인해 정규식을 확정한다(작업 4-0).

### 2.2 스탯 스트립 (집계용 4지표로 재정의)
프로토타입 토큰 그대로(`p-5`, `text-3xl font-bold`, `gap-4`)로 다음 4개:

| 라벨 | 값 | 색 |
|---|---|---|
| 전체 PR | 233 | 기본 |
| 머지됨 | merged 수 | `text-emerald-600` |
| 진행 중 | open 수 | `text-brand` |
| 참여 멤버 | unique author 수 | 기본 |

### 2.3 보조 surface — 접어서 demote
- **PR 목록(MissionList)**: 매트릭스 아래 `h2 + 분할 리스트 카드`로 유지하되,
  `missions.html` 행 레시피(상태 pill + 제목 + 메타 + 레포 + PR 링크)에 정확히 맞춤.
  필터 UI는 `admin.html`의 FE/BE 토글 스타일(`inline-flex rounded-lg ring-1`) 재사용.
- **MemberStats / RepoStats / RecentActivity**: 별도 풀폭 카드로 쌓지 않는다.
  매트릭스가 멤버 집계를 이미 보여주므로 **MemberStats는 매트릭스로 흡수(삭제)**.
  **RepoStats·RecentActivity는 완전 제거** ✅ (파일 삭제). 필요 시 추후 별도 탭으로 부활.

### 2.4 동기화 버튼 — admin.html 빠른 작업 줄로 편입
SyncButton을 헤더 아래 "빠른 작업" 행에 배치(`admin.html` line 28-33 패턴).
`px-3.5 py-2 rounded-lg ring-1 ring-slate-900/10` 보조 버튼 스타일로 통일.
마지막 동기화 시각/결과는 옆에 `text-sm text-slate-500`로.

### 2.5 최종 페이지 골격
```
헤더 (h1 "미션 현황" + 집계 배지 + 설명)
빠른 작업 줄 (동기화 버튼 + 마지막 동기화 시각)
4-up 스탯 스트립
h2 "멤버 × 미션 매트릭스" + 범례(완료/리뷰중/미제출)
  └ 매트릭스 테이블 (overflow-x-auto, sticky 멤버 열)
h2 "최근 PR" + 필터 토글
  └ 분할 리스트 카드 (missions.html 행 레시피)
헬퍼 텍스트 (text-xs text-slate-400)
```

## 3. 토큰 표준화 (전 컴포넌트 공통 적용)
- **카드**: `rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10`
- **스탯 카드 패딩/타이포**: `p-5` / 라벨 `text-sm text-slate-500` / 값 `text-3xl font-bold`
- **emerald 단일화**: 면(채움) `bg-emerald-500`, 글자 `text-emerald-600 dark:text-emerald-400`,
  배지 `bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300`. 임의 음영 금지.
- **상태 pill**: `text-xs px-2 py-1 rounded-full font-medium` + 의미색
- **분할선**: 리스트 `divide-y divide-slate-100 dark:divide-white/10`, 헤더 `border-b border-slate-900/5 dark:border-white/10`
- **보조 버튼**: `px-3.5 py-2 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 font-semibold`

## 4. 작업 항목
4-0. **(선행) 실제 PR 제목 샘플 확인** — DB의 `missions`에서 다주차 레포(advanced·whatever·self-paced-react)
   PR 제목 패턴을 조사해 step 추출 정규식 확정. (2.1.2)
1. `src/shared/core/constants/missionColumns.ts` 신규 — 2.1.1의 14주 열 상수(`MISSION_COLUMNS`)와
   `(repository, title) → weekIndex | null` 매핑 함수 정의.
2. `src/features/missions/MissionMatrix.tsx` 신규 — 멤버×14주 매트릭스. PR 데이터를
   `(author, week) → state` 로 집계, 완주율 열, sticky 멤버 열, 범례, 폴백 헬퍼 텍스트.
3. `MissionSummaryCards.tsx` 리스타일 — 프로토타입 토큰(p-5/text-3xl/gap-4), 4지표(2.2) 확정.
4. `MissionList.tsx` 리스타일 — `missions.html` 행 레시피로, 필터는 토글 스타일로 통일.
5. `SyncButton.tsx` — "빠른 작업" 줄 배치 + 보조 버튼 토큰.
6. `MemberStats.tsx`·`RepoStats.tsx`·`RecentActivity.tsx` **삭제**.
7. `src/app/missions/page.tsx` — 정적 placeholder를 2.5 골격으로 교체, 컴포넌트 조립.
   (현재 `'use client'` 위젯들은 그대로, page는 server component 유지하며 조립만)

## 5. 검증
- `npx tsc --noEmit` / `npm run lint` 통과
- 다크모드 대비 확인
- 빈 데이터(동기화 전) 상태에서 깨지지 않는지
- 모바일(`grid-cols-2`, `overflow-x-auto`) 레이아웃 확인

## 6. 결정 사항 (확정됨)
- **(A)** 주력 surface = 멤버 × 미션 매트릭스 ✅
- **(B)** RepoStats·RecentActivity = 완전 제거(파일 삭제) ✅
- **(C)** 매트릭스 열 = **주차 14주 단위** ✅ → PR→주차 매핑 전략은 2.1.2, 선행조사는 작업 4-0

### 남은 확인 (구현 중 해소)
- 다주차 레포 PR 제목의 실제 step 네이밍 컨벤션(작업 4-0에서 샘플 확인 후 정규식 확정).
  컨벤션이 불규칙하면 폴백(첫 주차 귀속 + 헬퍼 표기)으로 처리.
