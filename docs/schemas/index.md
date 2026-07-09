# 그리디 허브 — MongoDB 스키마 개요

## 컬렉션 목록

| 파일 | 컬렉션(들) | 설명 |
|---|---|---|
| [member.md](member.md) | `members` | 멤버 프로필·역할·권한 |
| [mission.md](mission.md) | `missions`, `missionSubmissions` | 미션 정의 + 멤버별 제출·리뷰 기록 |
| [post.md](post.md) | `posts` | 기술블로그 글·댓글 |
| [activity.md](activity.md) | `activities` | 활동 타임라인·사진 |
| [application.md](application.md) | `applications` | 기수 지원서 |
| [project.md](project.md) | `projects` | 팀 프로젝트 아카이브 |
| [study.md](study.md) | `studies` | 트랙별 주차 커리큘럼 |

## 관계 다이어그램

```
members ◄──────────── missionSubmissions ──────────► missions
   ▲  (memberId, reviewerId)  (missionId)               ▲
   │                                                     │
   │  posts.authorId                     studies.linkedMissionId
   │  activities.mentionedMemberIds
   │  activities.createdBy
   │  projects.teamMembers[].memberId
   └──── posts, activities, projects, applications(합격 후)

applications ──합격처리──► members (신규 문서 삽입)
```

## 역할 시스템 요약

`site.js`의 프론트엔드 페르소나(`guest / member / reviewer / staff / alumni`)와  
DB의 `MemberRole` 값은 다르다. 아래 매핑 참조.

| site.js 페르소나 | DB MemberRole | 주요 permissions |
|---|---|---|
| `guest` | (DB 없음, 비로그인) | 공개 멤버·블로그·활동·프로젝트 읽기 |
| `member` | `'멤버'` | 미션 제출, 블로그 쓰기, 활동 올리기 |
| `reviewer` | `'리뷰어'` | + `mission:review` |
| `staff` | `'리드'` 또는 `'메인테이너'` + 개별 권한 | + `mission:create`, `study:manage`, `recruit:review`, `admin:roles` |
| `alumni` | `'OB'` | 멤버와 동일 (프로필에 OB 뱃지) |

`permissions` 배열은 역할 기본값 위의 **개별 예외**만 저장한다.  
역할별 기본 권한은 애플리케이션 코드(`src/shared/core/constants/`)에서 관리.

## 공통 패턴

- **DB 문서형**: `_id: ObjectId`, `createdAt: Date`, `updatedAt: Date`
- **앱용 변환형**: `id: string`, 날짜 필드 `string` (ISO-8601)
- **PI 필드** (`email`, `discordId`, `studentId`): API 레이어에서 역할 기반 필터링
- **마크다운 저장**: `body`, `description`, `bio`, `reviewGuideline` 등 — 렌더링은 클라이언트
