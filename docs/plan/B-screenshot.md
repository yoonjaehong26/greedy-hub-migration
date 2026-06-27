# B · microLink resolve-once — 가장 중요한 비용 규칙

> **한 줄**: 스크린샷은 **사이트당 정확히 1회**만 외부 API를 소모한다. 사용자·조회가 늘어도 비용이 터지지 않게 하는 핵심 불변식.
>
> **선행**: 0단계 토대 · **걸린 결정**: D4(쿼터 운영) · D17(개발 mock) · **독립 기능 아님** → A의 쓰기 경로 안에서 동작
>
> 📄 개요: [../migration-plan.md](../migration-plan.md) · 결정: [../decisions.md](../decisions.md)

---

## 🎯 한눈에

- **무엇을**: URL → microlink API로 스크린샷 1장을 받아 `screenshotUrl`에 저장.
- **왜**: microlink 무료는 **하루 50건**. 매 조회마다 부르면 금방 터진다. 그래서 **쓸 때 한 번만** 부르고 결과 URL(microlink CDN 이미지)을 DB에 박아둔다. 이후 `<img>` 로드는 쿼터를 안 쓴다.
- **체감**: 등록자는 아무것도 안 해도 썸네일이 자동으로 생긴다.

> ⚠️ **B는 독립 기능이 아니다.** `resolveScreenshotUrl`은 **오직 `sitesRepo` 안에서만** 호출된다. 그래서 B는 A(등록)와 한 묶음으로 구현·검증한다. 이 문서는 그 "비용 규칙"만 떼어 설명한다.

---

## 🔁 호출 지점 — 오직 3곳 (전부 서버 `sitesRepo`)

```
쓰기 경로(서버)                         resolve 대상
─────────────────────────────────────────────────────
createSite()        ── 등록 ──►        홈 페이지 1개
addPagesToSite()    ── 페이지추가 ──►   추가된 각 페이지
ensureSeeded()      ── 최초 시드 ──►    시드 사이트의 홈만
─────────────────────────────────────────────────────
클라이언트 ────────────────────────►   ❌ 절대 호출 안 함 (읽기만)
```

**클라이언트는 저장된 `screenshotUrl`을 읽기만** 한다(`useSiteThumbnail`). 값이 `null`이면 `thumbnailColor` 그래디언트로 폴백.

---

## 📂 만드는 파일

| 파일 | 레이어 | 역할 |
|---|---|---|
| `shared/core/api/screenshotApi.ts` | core | `resolveScreenshotUrl(pageUrl): Promise<string \| null>` — **서버 전용** microlink 호출 |

```ts
// 핵심 시그니처
resolveScreenshotUrl(pageUrl)
//  GET https://api.microlink.io/?url=…&screenshot=true&meta=false&waitUntil=networkidle0
//  → data.screenshot.url  (실패 시 null)
```
- `waitUntil=networkidle0`: JS 렌더가 끝난 뒤 캡처(로딩 스피너 중간 캡처 방지).
- 호출 자체는 `sitesRepo`(shared/lib/db)에서 일어나므로, 이 파일은 "어떻게 부르는지"만 책임진다.

---

## 🧩 핵심 로직 / 주의

- **불변식**: 새 화면에서 스크린샷이 필요해지면 **클라 resolve를 추가하지 말고**, 쓰기 경로(등록/페이지추가/시드)에 resolve를 끼워 넣는다.
- **서비스 교체 용이**: 다른 스크린샷 API로 바꿀 땐 `screenshotApi.ts` 한 파일만 수정.
- ⚠️ **레이어 누수 금지**: `screenshotApi`를 `'use client'` 컴포넌트에서 import하면 microlink 키/쿼터가 브라우저로 샌다. import는 `sitesRepo`에서만.

---

## ⚖️ 이 기능의 결정

| 결정 | 상태 | 요지 |
|---|---|---|
| **D4** 쿼터 운영 | 🔴 | 무키 무료(50/일) + `screenshotUrl===null` 재resolve 안전망. KEY는 env 선택. |
| **D17** 개발 mock | 🔴 | `MOCK_SCREENSHOTS=true`면 실제 호출 없이 더미 URL 반환 → 개발 중 쿼터 소진 방지. |

> 💡 **개발 시 가장 먼저 터지는 게 이 쿼터다.** B/A를 반복 테스트하면 50건이 금방 소진된다. D17 mock을 켠 채로 개발하고, 실제 검증이 필요할 때만 끈다.

---

## ✅ 완료 체크리스트
- [ ] D4·D17 확정
- [ ] `screenshotApi.ts` 작성 (서버 전용 주석 명시)
- [ ] `MOCK_SCREENSHOTS` 분기 (D17)
- [ ] `sitesRepo`에서만 import되는지 확인 (A 단계와 함께 검증)

**Done 정의**: A의 `createSite`가 등록 시 홈 URL 스크린샷을 **1회** resolve해 DB에 저장한다(mock 켜면 더미). 클라이언트는 직접 호출하지 않는다.

➡️ 다음: [A-register.md](A-register.md)
