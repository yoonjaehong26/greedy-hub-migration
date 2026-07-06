# 결정 트래커 (Decision Log) — Moa 4기능 이식

> **이 문서의 목적**: 이식 과정에서 **사용자(=당신)가 직접 내려야 하는 결정**을 한곳에 모아 *상시 리마인드*한다. 바이브코딩으로 흘려보내지 않고, 내부 구조를 가르는 선택을 명시적으로 짚기 위한 문서.
>
> **운용 방식**:
> - 각 단계 착수 **전**에, 그 단계를 막는 결정(아래 표의 "막는 단계")을 내가 먼저 짚어드린다.
> - 당신이 고르면 상태를 🔴→🟢 로 바꾸고 **확정 근거 한 줄**을 기록한다.
> - 결정은 서로 **사슬로 묶여 있다**(특히 D1→D3→D2→`site.ts`). 0단계 게이트는 **한 번에 확정**하는 걸 권장.
>
> **상태 범례**: 🔴 미결 · 🟡 잠정(기본값으로 진행 중, 번복 가능) · 🟢 확정

---

## 요약 표

| ID | 결정 | 막는 단계 | 권장(기본) | 상태 |
|---|---|---|---|---|
| **D1** | 평가/적립(E) 결합 처리 | 0·C | **완전 제거** | 🟢 |
| **D2** | 인증 추상화 수준 | 0·1 | `getCurrentUserId` 헬퍼(상수 반환) | 🟢 |
| **D3** | 데이터 모델(status enum·domain·리네이밍) | 0(전부) | E제거 + `live\|removed` + 리네이밍 보류 | 🟢 |
| **D10** | 시각 시스템 충돌(soft/flat/glass) | 0 | **프로토타입 soft 일관** | 🟢 |
| **D10a** | 썸네일 레이아웃(자연높이 vs 고정높이) | 2(C) | 자연높이 메이슨리(실제 프리뷰 보존) | 🔴 |
| **D11** | env·시크릿 부트스트랩 | 0·1 | `.env.local`+`.env.example`, 컬렉션 `sites`/`users` | 🔴 |
| **D13** | Pretendard 폰트 로딩 | 0 | `next/font/local` self-host | 🔴 |
| **D15** | 테마/다크모드 상태 소유 + persist | 0 | `shared/core/stores` Zustand(persist O)+`[data-theme]` | 🔴 |
| **D4** | microlink 쿼터 운영 정책 | 1(B) | 무키 무료 + null 재resolve 안전망 | 🟢 |
| **D6** | frame-check 타임아웃·안전기본값 | 1·3 | 7s, unknown=차단, 상수화 | 🟢 |
| **D16** | id 생성·thumbnailColor 발급·domain 파싱 | 1·2 | nanoid id, 해시순환 색, www제거 도메인 | 🟢 |
| **D17** | 개발 중 microlink 쿼터 보호(mock) | 1 | `MOCK_SCREENSHOTS` env 토글 | 🟢 |
| **D8** | 피드 스케일(페이지네이션) | 2(C) | 서버 status 필터 + 전체 live 반환 | 🟢 |
| **D14** | `next/image` vs `<img>` | 2(C) | `<img>`(외부 도메인이라 최적화 의미 적음) | 🟢 |
| **D7** | iframe sandbox 정책 | 3(D) | `allow-scripts allow-same-origin allow-forms allow-popups` | 🟢 |
| **D5** | 시드 데이터 | 1~2 | 실제 산출물 3~6개 + frame-check 사전계산 | 🔴 |
| **D9** | cross-feature import 강제 | (가로지름) | ESLint zone 추가 | 🔴 |
| **D12** | 루트 라우트 충돌 처리 | 0·2 | `page.tsx` → `(feed)/page.tsx` 이동 | 🔴 |

> 대부분 CLAUDE.md의 **"멈추고 승인받기"**(아키텍처·데이터모델·레이어 예외·UX) 대상이다.

---

## 0단계 게이트 (토대를 막음 — 먼저 확정)

### D1 · 평가/적립(E) 결합을 제거할지 / 표시전용으로 둘지
- **무엇이 갈리나**: `Site` 타입 필드 수, `SiteDoc`↔`toSite(doc,userId)` 매핑, `FeedGrid` 정렬·featured 분기, `SiteCard`의 `RewardBadge`/`isPaid` 분기, `completeSite`/complete API/`useCompleteSiteMutation`의 존재 여부.
- **선택지**: ① 완전 제거 · ② 표시 전용 유지(항상 고정값, dead code) · ③ 부분 유지(권장 안 함 — 정렬키가 어중간해짐).
- **권장 ①(완전 제거)**: 그리디는 결제·적립이 도메인 비목표(PRD N4)라 `isPaid/reward/fundingSource`가 의미 없고, 인증 없는 현 단계(D2)에서 `completedByMe`(사용자별 값)를 만들 수 없다. → 정렬 `createdAt desc` 단일, featured `index===0 && columns>1`, `SiteDoc`에서 `completedBy` 제거(=`toSite`의 `userId` 인자 불필요), RewardBadge 미생성.
- **막는 단계**: C(정렬·뱃지) 직접 / B·D 간접.
- 🟢 **확정 (2026-06-27)**: 완전 제거. `isPaid`/`reward`/`fundingSource`/`completedByMe` 필드·`RewardBadge`·`completeSite`·complete API·`useCompleteSiteMutation` **미생성**. 정렬=`createdAt desc` 단일, featured=`index===0 && columns>1`. `SiteDoc`=`Site`와 동일(`completedBy` 없음) → `toSite(doc)`는 `userId` 인자 불필요.

### D2 · 인증을 어디까지 추상화할지
- **무엇이 갈리나**: `POST /api/sites`가 `ownerId`를 어디서 얻는지(상수 vs 세션), `toSite`에 넘길 `userId` 출처, `usersRepo`/`/api/me`의 필요 여부, 향후 소유권/내 등록물 필터 가능성.
- **선택지**: ① 하드코딩 `ME_USER_ID` 그대로 · ② 그리디 기존 세션에 연결 · ③ `getCurrentUserId` 헬퍼로 격리(지금은 상수 반환) · ④ 익명 등록(운영상 위험, 부적합).
- **권장 ③**: 4기능엔 고정 유저로 충분(spec §0.4)하면서, 그리디는 G3에서 실제 인증이 로드맵에 있으므로 `ownerId` 출처를 한 곳(`getCurrentUserId`)에 격리하면 향후 세션 연결이 **한 줄 교체**가 된다. 정식 OAuth 연동(②)은 이식 범위 밖.
- **주의**: `/api/me`/`getMe`를 만들지 여부는 이 결정과 정합해야 함(③이면 거의 불필요).
- **막는 단계**: A(ownerId) / C·D 간접.
- 🟢 **확정 (2026-06-27)**: `getCurrentUserId()` 헬퍼로 격리. 현재는 상수 `ME_USER_ID='user-me-001'`을 반환. `POST /api/sites`·라우트가 이 헬퍼만 호출 → 향후 그리디 세션 연결은 **헬퍼 한 곳 교체**. 정식 OAuth 연동은 범위 밖. `/api/me`·`getMe`는 **만들지 않음**(헬퍼로 충분).

### D3 · 데이터 모델 — status enum·domain·리네이밍
- **무엇이 갈리나**: `status` enum 범위(`live|reported|removed` 전부 둘지), `domain` 저장 vs url 파생, `Site→Project` 도메인 리네이밍 여부, `Page` 1~4개 제한.
- **선택지**: ① §0.1 스키마 그대로 · ② E제거 + `status:'live'|'removed'`(신고 기능 없으니 `reported` 제외, 소프트삭제용 `removed` 유지) · ③ 최소 스키마 + `Site→Project` 리네이밍.
- **권장 ②**: `reported`는 신고 UI가 이식 범위 밖이라 쓰기 경로 없는 죽은 상태가 되므로 제외, `removed`는 소프트삭제용 유지. `domain`은 정렬·표시·중복검사 편의로 저장 유지. **리네이밍(Site→Project)은 1차 보류**(이식 범위·Moa 원본 대조 비용 ↑) → 별도 후속 결정.
- **막는 단계**: A·B·C·D 전부(단일 타입 출처).
- 🟢 **확정 (2026-06-27)**: E 필드 제거 + `status:'live'|'removed'`(신고 기능 없으니 `reported` 제외, 소프트삭제용 `removed` 유지). `domain` 저장 유지, `Page` 1~4개 제한 유지. **`Site→Project` 리네이밍은 1차 보류**(별도 후속 결정).

### D10 · 시각 시스템 충돌 (soft / flat / glass)
- **무엇이 갈리나**: `theme.ts`·`GlobalStyle`·모든 카드 컴포넌트. 세 가지 시각 언어가 충돌한다 — 프로토타입 **soft**(rounded-2xl+shadow-sm+ring, hover lift) / Moa 스펙 **flat**(인스타식 무그림자) / RegisterModal **글래스모피즘**.
- **선택지**: ① 프로토타입 soft 일관 · ② Moa flat 일관 · ③ **절충**: 동작·레이아웃은 Moa 규칙(메이슨리 자연높이, 480/900 분기, featured span-2), 색(brand `#017356`)·폰트(Pretendard)·라운드·칩·버튼만 프로토타입에서 차용, 모달 글래스는 최소화.
- **권장 ③**: 그리디 브랜드 정체성(그린·Pretendard)은 살리되 피드/라이브뷰의 핵심 UX는 Moa 검증된 패턴을 따른다. **UX 결정이라 승인 필요.**
- **막는 단계**: 0(theme·GlobalStyle).
- 🟢 **확정 (2026-06-27)**: **프로토타입 soft 일관**. 카드 표면 = `rounded-2xl` + `shadow-sm` + `ring-1`(slate-900/5) + `hover:-translate-y-0.5`. `theme.ts`에 shadow/ring 토큰 포함, **Moa의 flat(무그림자)을 따르지 않는다**. `RegisterModal`은 과한 글래스모피즘 대신 soft solid 카드로 정합. ⚠️ 단, 표면 스타일과 별개인 '썸네일 높이' 결정은 D10a로 분리.

### D10a · 썸네일 레이아웃 — 자연높이 메이슨리 vs 고정높이
- **무엇이 갈리나**: `SiteCard`/`BlockedCard`가 microlink 스크린샷을 어떻게 보여줄지. D10(soft)은 카드 *표면*만 정했고, 이미지 *높이*는 별개의 레이아웃 선택이다.
- **선택지**: ① **자연높이 메이슨리**(Moa — `width:100%;height:auto`, 사이트별 비율 보존, 가변높이 그리드) · ② 고정높이(프로토타입 — `h-32` 그래디언트 박스, 모든 카드 동일 높이).
- **권장 ①**: microlink 스크린샷을 **온전히** 보여주는 게 이 기능의 핵심 가치. 고정높이는 프로토타입과 픽셀 일치하지만 스크린샷이 잘리거나 레터박스된다. soft 카드 표면 **안에** 자연높이 이미지를 넣는 조합이 D10(soft)와 양립한다.
- **막는 단계**: 2(C SiteCard). **확정 근거**: _(미정)_

### D11 · env / 시크릿 부트스트랩
- **무엇이 갈리나**: 앱이 부팅·DB 접속 가능한지. 현재 `.env*` 없음 + `mongodb.ts`가 `MONGODB_URI!`.
- **결정 항목**: `.env.local` 키 목록(`MONGODB_URI` 필수, `MICROLINK_API_KEY` 선택, `MOCK_SCREENSHOTS` 선택 — D17), `.env.example` 추가 여부, **MongoDB DB명·컬렉션명**(spec에 명시 없음 — 예: DB `greedy-hub`, 컬렉션 `sites`/`users`), Vercel 환경변수 주입.
- **권장**: `.env.example` 커밋(키만, 값 없이), 컬렉션 `sites`/`users`, DB명은 Atlas 클러스터에 맞춰 확정. **MongoDB Atlas URI가 필요** — 준비돼 있나요?
- **막는 단계**: 0·1(첫 DB 쓰기). **확정 근거**: _(미정)_

### D13 · Pretendard 폰트 로딩 방식
- **무엇이 갈리나**: 폰트가 실제로 뜨는지 + 로딩 성능/FOUT. 프로토타입은 CDN, 레포에 폰트 자산 없음. `GlobalStyle`의 `font-family`만으로는 안 뜬다.
- **선택지**: ① `next/font/local`(self-host, 권장 — 성능·프라이버시) · ② `next/font/google` 류 · ③ CDN `@import`(임시·빠름).
- **권장 ①** 또는 우선 ③으로 시작 후 ①로 전환. self-host면 woff2 자산을 `public/`이나 `src/`에 추가해야 함.
- **막는 단계**: 0. **확정 근거**: _(미정)_

### D15 · 테마/다크모드 상태 소유 위치 + persist
- **무엇이 갈리나**: 다크 토글 상태의 소유처, SSR 하이드레이션 불일치(FOUC) 방지, persist 여부. FeedGrid sticky 바·LiveCard가 모두 다크 토큰을 읽는다.
- **선택지**: ① `shared/core/stores`에 작은 Zustand(persist O) + `[data-theme]` 속성 토글 · ② `localStorage` 직접 + `<script>` 선주입 · ③ next-themes 류 라이브러리(새 의존성 — 승인 대상).
- **권장 ①**: architecture.md가 "전역 UI 상태(테마 등)는 `shared/core/stores`"라 명시. persist 키 `greedy-hub-theme`, 하이드레이션 FOUC는 `layout`의 인라인 스크립트로 초기 `[data-theme]` 설정.
- **막는 단계**: 0(GlobalStyle 토큰 소비). **확정 근거**: _(미정)_

---

## 1단계 게이트 (B+A 등록을 막음)

### D4 · microlink 쿼터(50건/일) 운영 정책
- **선택지**: ① 무키 무료 + 실패 시 null 폴백, 재시도 없음(원본) · ② 무키 무료 + `screenshotUrl===null`만 재resolve 안전망 · ③ 유료/API키(`MICROLINK_API_KEY`).
- **권장 ① 출시 + ② 안전망 준비**: resolve-once+CDN 캐싱이라 정상 트래픽엔 50/일 거의 안 씀. 단 모집 시즌 동시 등록·일시 장애로 null이 박히면 영구 폴백이 되므로, null인 페이지만 쓰기 경로로 다시 resolve하는 가벼운 안전망(관리자 액션/백그라운드)을 둔다. **클라 직접 호출 금지 불변식은 절대 유지.**
- **막는 단계**: 1(B) → C·D 폴백 품질.
- 🟢 **확정 (2026-06-27)**: 무키 무료 + `MOCK_SCREENSHOTS=true` 시 즉시 null 반환 (`screenshotApi.ts`). 쿼터 실패·네트워크 오류도 null 폴백. 재시도 없음(resolve-once). `screenshotUrl===null` 재resolve 안전망은 향후 관리자 기능으로 분리.

### D6 · frame-check 타임아웃 & 안전 기본값
- **무엇이 갈리나**: 등록 속도 + 라이브뷰 폴백 비율. frame-check 4s, iframe 7s, `checkFrameBlocked` 실패=`true`(차단).
- **선택지**: ① 원본(4s/7s, unknown=차단) · ② 타임아웃 상향(6~8s) · ③ unknown=허용(낙관적 — 빈 흰 iframe 위험).
- **권장 ①**: spec 설계 철학이 "모르면 막아 iframe 깨짐 방지", BlockedCard 폴백이 우아해 false-positive 비용이 낮다. 두 타임아웃은 **상수(constants)로 노출**해 튜닝 가능하게.
- **막는 단계**: 1(A 등록 지연) · 3(iframe vs BlockedCard).
- 🟢 **확정 (2026-06-27)**: 타임아웃 **7초 단일** (`TIMEOUT_MS=7000` — `useFrameCheck.ts`·`LiveCard.tsx`에서 동일 상수 사용). `onload` 미도달 시 `frameBlocked=true`. unknown=차단 원칙 유지. X-Frame-Options DENY 사이트는 `onload`가 발화하지 않아 타임아웃으로 자연스럽게 처리됨.

### D16 · id 생성 · thumbnailColor 발급 · domain 파싱/중복
- **무엇이 갈리나**: 모든 라우트·쿼리키가 의존하는 `Site.id` 생성 주체(spec은 `pageId=nanoid`만 명시), 폴백 색 `thumbnailColor` 발급 규칙(팔레트를 무엇으로 순환?), `domain` 파싱 규칙(www/서브도메인), URL 중복 등록 허용 여부.
- **권장**: `Site.id`=`nanoid`(pageId와 동일), `thumbnailColor`=등록 순서/URL 해시 기반 팔레트 순환(단색 기반), `domain`=`new URL(url).hostname`에서 `www.` 제거. **URL unique 인덱스는 1차 보류**(또는 soft 경고) — 도배 방지는 인증(D2) 도입 후.
- **막는 단계**: 1(id) · 2(thumbnailColor·domain).
- 🟢 **확정 (2026-06-27)**: `Site.id`·`Page.pageId` = `nanoid`. `thumbnailColor` = 도메인 해시 기반 8색 팔레트 결정론적 순환 (`colorFromDomain()` in `sitesRepo.ts` — 같은 도메인=같은 색). `domain` = `new URL(url).hostname`에서 `www.` 제거. URL unique 인덱스 1차 보류.

### D17 · 개발 중 microlink 쿼터 보호 (mock)
- **무엇이 갈리나**: B/A 반복 테스트로 **개발 단계에서 50/일이 금방 소진**되면 이후 작업이 전부 폴백만 보게 된다.
- **권장**: `MOCK_SCREENSHOTS` env 토글 — 켜지면 `resolveScreenshotUrl`이 실제 호출 없이 고정 더미 이미지 URL(또는 null) 반환. 실제 microlink 검증이 필요할 때만 끔.
- **막는 단계**: 1(B 개발).
- 🟢 **확정 (2026-06-27)**: `MOCK_SCREENSHOTS=true` 이면 `screenshotApi.ts`가 즉시 `null` 반환 (microlink 미호출). 개발 중 `.env.local`에 설정. 실제 검증 시에만 해제.

---

## 2단계 게이트 (C 피드를 막음)

### D8 · 피드 스케일 — 전체 로드 vs 페이지네이션
- **무엇이 갈리나**: `/api/sites` 계약(C와 D가 같은 전체목록 쿼리를 공유, D는 인덱스 네비게이션 전제), status 필터를 서버/클라 어디서.
- **선택지**: ① 전체 로드 + 클라 필터(원본) · ② **서버 status 필터 + 전체 live 반환** · ③ 커서 페이지네이션(D 재설계 필요, 과투자).
- **권장 ②**: 전체 로드 모델은 D 네비게이션 전제라 깨면 안 되고 그리디 규모(수십~수백)엔 충분. 단 `removed`를 네트워크에 싣지 않게 status 필터만 서버로 올린다. 수백 초과 시 D 포함 재설계.
- **막는 단계**: 2(C) · D 공유.
- 🟢 **확정 (2026-06-27)**: 서버 status 필터 + 전체 live 반환 (`GET /api/sites`에서 `status==='live'` filter). C·D 모두 `useSitesQuery()` 단일 훅 공유. 수백 초과 시 커서 페이지네이션 재설계.

### D14 · `next/image` vs `<img>`
- **무엇이 갈리나**: `next/image`를 쓰면 microlink CDN 도메인을 `next.config`의 `images.remotePatterns`에 등록해야 함(미등록 시 런타임 에러).
- **권장 `<img>`**: 임의의 외부 도메인 스크린샷이라 `next/image` 최적화 이점이 적고 remotePatterns 관리가 번거롭다. spec도 `<img>` 자연높이 렌더 전제. `next/image`를 택하면 remotePatterns에 microlink 호스트 추가 필요.
- **막는 단계**: 2(C SiteCard·BlockedCard).
- 🟢 **확정 (2026-06-27)**: `<img>` 사용 (`SiteCard.tsx`). 임의 외부 도메인 스크린샷이라 `next/image` 최적화 이점 없음. `remotePatterns` 추가 불필요.

---

## 3단계 게이트 (D 라이브뷰를 막음)

### D7 · iframe sandbox 정책
- **무엇이 갈리나**: 임의 외부 URL을 iframe으로 띄우는 보안 + 체험 품질. 원본: `sandbox="allow-scripts allow-same-origin allow-forms allow-popups"`, `allow-top-navigation` 없음.
- **선택지**: ① 원본 유지 · ② 더 엄격(`allow-same-origin` 제거 → 다수 사이트 렌더 깨짐, 핵심 체험 훼손) · ③ 엄격 + 등록 URL 허용리스트(공개등록 시, 무마찰 등록과 충돌).
- **권장 ①** + **보강**: D의 핵심 가치가 '살아있는 iframe'이라 `allow-same-origin` 제거는 체험을 깬다. 멤버 등록 전제(D2)면 악성 임베드 리스크 낮음. `allow-top-navigation` 미부여 **반드시 유지**(부모 탈취 방지), 추가로 `referrerpolicy="no-referrer"` + 권한정책 `allow=""`(카메라/마이크/결제 차단). 공개(비멤버) 등록을 허용한다면 그때 ③ 재검토.
- **막는 단계**: 3(D).
- 🟢 **확정 (2026-06-27)**: `sandbox="allow-scripts allow-same-origin allow-forms allow-popups"` (`LiveCard.tsx`). `allow-top-navigation` 미부여(부모 URL 탈취 방지). 공개 등록 허용 시 허용리스트(③) 재검토.

---

## 가로지르는 결정

### D5 · 시드 데이터(ensureSeeded)
- **선택지**: ① 시드 없음(빈 상태 UI로 충분) · ② **실제 그리디 산출물 3~6개** + 홈 screenshot resolve + **frame-check 사전계산** · ③ 더미(공식 허브에 부적합).
- **권장 ②**(또는 데모 부담 없으면 ①): 빈 피드는 D 핵심 체험을 시연 못 한다. 실제 동아리 프로젝트 3~6개를 시드하면 도메인 가치+첫인상. **시드 시 frame-check까지 돌려 `frameBlocked`를 doc에 사전 계산**해야 D가 정상 동작(안 하면 frameBlocked 미정의로 오동작). ⚠️ 멱등성 키·재시드 정책, 빌드/배포 시점 URL reachability도 함께 정해야 함.
- **막는 단계**: C(첫 상태)·D(시연 콘텐츠)·B(시드 resolve). **확정 근거**: _(미정)_

### D9 · cross-feature import 강제 (검증된 미강제 사실)
- **무엇이 갈리나**: `.eslintrc.json`에 `features/A → features/B` 금지 zone이 **없다**(현재 zone 3개뿐). CLAUDE.md "기능 간 직접 참조 금지"는 규약일 뿐 **빌드가 막지 않는다**. 특히 `SiteCard`(feed)→`live` import 실수를 린트가 못 잡는다.
- **선택지**: ① `import/no-restricted-paths`에 feature 간 zone 추가(11쌍 일반화 방법 필요) · ② 규약만 믿고 강제 없이 진행 · ③ 다른 도구(eslint-plugin-boundaries 등 — 새 의존성).
- **권장 ①**: setup.md/architecture.md가 약속한 "위반 시 빌드 실패"를 실효화. 다만 zone 추가 = 레이어 ESLint 설정 변경이라 **architecture.md/setup.md 동기화** 동반.
- **막는 단계**: 가로지름(품질·안전망). **확정 근거**: _(미정)_

### D12 · 루트 라우트 충돌 처리
- **무엇이 갈리나**: `src/app/page.tsx`(플레이스홀더)와 신규 `app/(feed)/page.tsx`는 **둘 다 `/`로 해석되어 빌드 실패**. 선택이 아니라 처리 필수.
- **선택지**: ① 기존 `page.tsx` 삭제하고 `(feed)/page.tsx`로 대체 · ② `(feed)` 그룹 안 쓰고 기존 `page.tsx`에서 `FeedGrid` 렌더 · ③ 피드를 `/projects` 등 다른 경로에 두고 `/`는 별도 랜딩.
- **권장 ①** 또는 ②: 피드가 홈이면 ②가 단순. 그리디가 별도 랜딩(PRD 7장 공개 홈)을 원하면 ③. **라우팅 구조 결정이라 승인 대상.**
- **막는 단계**: 0(정리 방침)·2(실제 배치). **확정 근거**: _(미정)_

---

## 미션 대시보드 게이트 (`/missions`)

> 별도 트랙. 상세 설계는 [missions-dashboard.md](./missions-dashboard.md). 아래는 확정된 결정만.

### D18 · 데이터 전략 — 하이브리드 🟢
- **무엇이 갈리나**: 순수 GitHub sync / 완전 수동 DB / **하이브리드**.
- **확정 근거**: 기수마다 커리큘럼 상이·cross-cohort·공용 레포(비회원 수백)·테스트 PR 때문에 순수 자동화 불가. **큐레이션 명부/카탈로그(정답) + sync(후보 PR) + 오버라이드(교정)** 로 확정. 노션 분석 결론과 일치.

### D19 · 파일럿 범위 = 3기, 확장 3→2→4→1 🟢
- **확정 근거**: 3기가 데이터 명확. 1기는 레포 삭제·탈퇴·기수중복 예외 최다라 마지막. 확장은 상수(명부·카탈로그·날짜창)만 편집 — 로직/UI 불변.

### D20 · 귀속 3원칙 (명부·작성자·날짜창) 🟢
- **확정 근거**: 공용 레포라 ①명부 멤버만 ②PR 작성자(user.login, 리뷰어 제외) ③createdAt 날짜창으로 기수 분리. 명부밖 작성자는 개별 큐 대신 카운트만(수백 규모). 강동현 2기 FE PR 자동 분리 검증 완료.

### D21 · 완주 판정 단위 = 단계(step), 셀 4상태 🟢
- **무엇이 갈리나**: 레포 단위 완주 vs **단계 단위**.
- **확정 근거**: PR 1개 ≠ 미션 1개(한 PR이 여러 단계 묶음, 재제출·미머지 섞임). 레포 단위 "완료"는 착시(서현진 방탈출 3/9인데 완료로 보임). 셀 4상태 `done/pending(머지만)/gap(PR누락)/none`으로 "머지 대기"와 "진짜 누락"을 색 구분 → QA 핵심.

### D22 · 제목→단계 매핑 = 큐레이션 파서 + 오버라이드 🟢
- **확정 근거**: PR 제목 규칙이 멤버마다 5종(단계/주차/stepN/adv-2.1/페이즈명). 단계번호+페이즈 키워드 병행 인식(`matchUnits`). 실데이터 912건 매핑불명 0건 검증. 새 표기·예외는 매핑불명(QA)으로 노출 → `matchUnits` 규칙 추가 or `prOverrides` 확정. **한계**: 자유 텍스트 의존이라 규칙은 큐레이션.

---

## 변경 이력
- **2026-06-27 (1)** 18개 결정 식별 — 8개는 스펙 직접, 9개는 완전성 비평에서 보강. 전부 🔴 미결.
- **2026-06-27 (2)** 0단계 게이트 4개 확정: **D1 완전제거 · D2 getCurrentUserId · D3 E제거+live\|removed · D10 프로토타입 soft 일관**(→🟢). D10에서 파생된 썸네일 높이 결정 **D10a** 신설(🔴).
- **2026-06-27 (3)** A+B+D 구현 완료로 1·2·3단계 게이트 결정 7개 확정: **D4·D6·D7·D8·D14·D16·D17**(→🟢). 미결 잔존: D5·D9·D10a·D11·D12·D13·D15.
- **2026-07-06** 미션 대시보드(`/missions`) 3기 파일럿 구현. 결정 **D18~D22** 신설·확정(🟢). 단계 단위 집계·귀속 3원칙·하이브리드 데이터 전략. 상세: [missions-dashboard.md](./missions-dashboard.md).
