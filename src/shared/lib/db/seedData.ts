// 개발용 초기 시드 데이터 — 실제 그리디 프로젝트로 교체 예정 (D5)
export const SEED_SITES = [
  {
    title: 'Greedy Hub',
    description: '그리디 동아리 공식 허브 — 연혁·멤버·스터디·미션을 한곳에서 관리',
    homeUrl: 'https://vercel.com',
    thumbnailColor: '#017356',
    frameBlocked: false,
  },
  {
    title: '알고리즘 스터디',
    description: '매주 진행하는 PS 스터디 풀이 아카이브. BOJ·프로그래머스 분류별 정리.',
    homeUrl: 'https://github.com',
    thumbnailColor: '#7C3AED',
    frameBlocked: true,
  },
  {
    title: '그리디 리크루트',
    description: '그리디 신입 모집 랜딩 페이지. 동아리 소개와 지원 양식을 한 화면에.',
    homeUrl: 'https://www.figma.com',
    thumbnailColor: '#0EA5E9',
    frameBlocked: false,
  },
] as const;
