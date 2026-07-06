# 그리디 허브 (Greedy Hub) — Agent Guide
> 그리디의 연혁·멤버·스터디·미션·게시판·지원·추억을 한곳에서 추적하는 세종대학교 개발 동아리 공식 허브

## 스택
Next.js App Router · TypeScript · styled-components · Zustand · TanStack Query · MongoDB  
배포: Vercel + MongoDB Atlas

## 빠른 명령
```bash
npm run dev          # 개발 서버
npx tsc --noEmit     # 타입 체크
npm run lint         # ESLint (레이어 규칙 포함)
npm run test         # vitest
```

## 핵심 규칙 3가지 (위반 시 빌드 실패)
1. `features/ → shared/*` 만 허용. 역방향·기능 간 직접 참조 금지
2. 서버 상태 = TanStack Query / 클라이언트·UI 상태 = Zustand — 절대 혼용 금지
3. fetch·DB 호출은 `*Api.ts` 에만. 컴포넌트는 Query 훅만 사용

## 디렉토리 한눈에
```
src/
├── app/            라우팅만 (로직 없음)
├── features/       도메인별 세로 슬라이스
└── shared/
    ├── core/       api · stores · queries · types · constants
    ├── lib/        db · utils · hooks
    ├── components/ ui · providers
    └── reader/     진입점 (features 의존 허용 — 유일한 예외*)
```
*reader 예외는 ESLint zone에서 제외되어 있음 (`docs/architecture.md` 참조)

## 의사결정 기준
- **멈추고 승인받기**: 아키텍처 변경 · 새 라이브러리 · 데이터 모델 변경 · 레이어 예외 · UX 변경
- **자율 진행**: 버그 수정 · 타입 에러 · 컨벤션 정리 · 기존 패턴 복사
- **언급 후 진행**: 성능 선택(memo 등) · 예상보다 영향 범위 클 때

## 상세 문서 (필요할 때만 읽기)
| 언제 | 읽을 파일 |
|---|---|
| 코드 스타일·네이밍·파일 구조 | `docs/conventions.md` |
| 아키텍처 결정·레이어 ESLint 설정 | `docs/architecture.md` |
| 최초 프로젝트 세팅 (1회) | `docs/setup.md` |
| 미션 대시보드(`/missions`) 설계·기수 확장·재이식 | `docs/missions-dashboard.md` |

## 커밋 메시지
```
<type>(<scope>): <subject>
```
type: `feat` `fix` `refactor` `docs` `style` `chore`

## 작업 완료 체크
```
□ npx tsc --noEmit 통과
□ npm run lint 통과
□ 구조·타입·규칙 변경 시 해당 docs/ 업데이트
```