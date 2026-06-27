# 그리디 프론트엔드 미션 커리큘럼

> 총 14주차 · JavaScript 3주 + React 11주

## 추적 레포 목록

| 주차 | 미션명 | 레포 |
|---|---|---|
| 1주차 | Javascript 숫자야구 | `greedy-team/javascript-baseball-precourse` |
| 2주차 | Javascript 탐욕의 룰렛 | `greedy-team/javascript-greedy-roulette` |
| 3주차 | Javascript 좀비 게임 | `greedy-team/javascript-zombie-survival` |
| 4~5주차 | React 기초 (cho-log 협업) | `cho-log/self-paced-react` |
| 6~9주차 | React 심화 | `greedy-team/self-paced-react-advanced` |
| 10~12주차 | 무엇이든 만들어보세요 | `greedy-team/react-whatever-you-want` |
| 13~14주차 | React 포켓몬 도감 (SSR) | `greedy-team/react-pokemon-ssr` |

---

## 주차별 상세

### 1~3주차: JavaScript 기초

**1주차 — 숫자야구** (`javascript-baseball-precourse`)
- 바닐라 JS로 숫자야구 게임 구현

**2주차 — 탐욕의 룰렛** (`javascript-greedy-roulette`)
- 바닐라 JS로 룰렛 게임 구현

**3주차 — 좀비 게임** (`javascript-zombie-survival`)
- 바닐라 JS로 좀비 서바이벌 게임 구현

---

### 4~5주차: React 기초 (`cho-log/self-paced-react`)

**Step 1~3**
- 컴포넌트 개념, JSX와 HTML 차이
- React 상태 관리 및 데이터 흐름
- 조건부 렌더링 (모달 구현)

**Step 4~5**
- 재사용 가능한 컴포넌트 설계 (`children`)
- API 요청과 비동기 처리, JS 싱글 스레드

---

### 6~9주차: React 심화 (`self-paced-react-advanced`)

**Step 1 (6주차)**
- Styled-Components 스타일링

**Step 2-1 (7주차)**
- Context API 전역 상태 관리

**Step 2-2 (8주차)**
- Zustand 클라이언트 상태 관리

**Step 2-3 (9주차)**
- TanStack Query 서버 상태 관리

---

### 10~12주차: 무엇이든 만들어보세요 (`react-whatever-you-want`)

**Step 1**
- React Router SPA 구현

**Step 2**
- 사용자 경험 및 웹 접근성 개선

**Step 3**
- 테스트 코드 작성 및 커버리지 향상

---

### 13~14주차: SSR (`react-pokemon-ssr`)

- Express + Vite 미들웨어로 React SSR
- 서버에서 PokeAPI 데이터 프리패칭 및 HTML 직렬화
- Hydration mismatch 해결
- URL 기반 서버사이드 라우팅

---

## 참고

- 각 미션의 상세 수행 방법은 해당 레포의 README 참고
- `/missions` 대시보드: GitHub PR 자동 동기화 (Vercel Cron daily + 수동 버튼)
- 레포 추가: `src/shared/lib/db/trackedReposRepo.ts`의 `SEED_REPOS` 수정 후 MongoDB `trackedRepos` 컬렉션 초기화
