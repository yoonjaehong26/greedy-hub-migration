/**
 * activities.ts — 활동 타임라인 목 데이터
 *
 * 출처: 노션 "이진님 활동 페이지(mcp용)" 안에 인라인으로 있던 실제 활동 기록 데이터베이스
 * (그리디 허브 미션 아카이빙 > 목업용 데이터 설정 > 메모, 2026-07-10 확인). 이름·날짜·캡션은
 * 그 데이터베이스의 실제 행 17건을 그대로 반영 — 이전엔 가짜 이름·창작 내용으로 채워져 있던 걸
 * 실데이터로 교체(2026-07-10).
 *
 * id 1(그리디 창립, 2024.09)만 예외 — 원본 데이터베이스엔 창립일 자체를 기록한 행이 없지만,
 * "그리디 2기 MT" 항목(id 13)의 캡션에 "그리디 1주년 축하"(2025-09-19)라는 언급이 있어
 * 2024년 9월 창립을 역산해 추가한 것. 나머지는 전부 노션 원본 행 그대로.
 *
 * `날짜`는 노션엔 특정 일자(YYYY-MM-DD)로 있지만 이 계약(§6)은 "YYYY.MM" 표기라 월 단위로 절삭.
 * `링크`(원본은 디스코드 메시지 permalink)는 이미지 URL이 아니라서 목업엔 반영하지 않음 —
 * 실제 사진은 디스코드에서 별도로 다운로드해 Vercel Blob 등에 재호스팅해야 진짜 URL이 나온다
 * (그 전까지 images는 picsum.photos placeholder). participants는 노션에 없어 각 활동 시점에
 * 실제로 활동 중이던 멤버(SOT: `src/mocks/data/members.ts`)를 기준으로 추론해 채운 것.
 *
 * tag = 세부 라벨(행사/세션/데모데이/축제/창립). category 필터 버킷 매핑은 서버가 아니라
 * 프론트(src/features/activities/categoryFilter.ts)가 처리한다.
 */

export type ActivityTag = '행사' | '세션' | '데모데이' | '축제' | '창립';

export interface MockActivityImage {
  id: number;
  url: string;
  sortOrder: number;
}

export interface MockActivityParticipant {
  memberId: number | null;
  name: string;
}

export interface MockActivity {
  id: number;
  date: string;
  tag: ActivityTag;
  title: string;
  summary: string;
  body: string;
  images: MockActivityImage[];
  participants: MockActivityParticipant[];
}

function placeholderImages(activityId: number, count: number): MockActivityImage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: activityId * 10 + i,
    url: `https://picsum.photos/seed/greedy-activity-${activityId}-${i}/640/480`,
    sortOrder: i,
  }));
}

export const ACTIVITIES: MockActivity[] = [
  {
    id: 1,
    date: '2024.09',
    tag: '창립',
    title: '그리디 창립',
    summary: '개발에 진심인 사람들이 모여 그리디를 만들었습니다.',
    body: '개발에 진심인 사람들이 모여 그리디를 만들었습니다.',
    images: placeholderImages(1, 1),
    participants: [
      { memberId: 1, name: '이승용' },
      { memberId: 2, name: '원태연' },
      { memberId: 3, name: '김수민' },
      { memberId: 4, name: '김범수' },
      { memberId: 5, name: '김주환' },
    ],
  },
  {
    id: 2,
    date: '2024.11',
    tag: '행사',
    title: '그리디 1기 단체 회식',
    summary: '와 재미나고 맛있었다!! 다음에는 못 온 사람들도 다같이 놀았으면.',
    body: '와 재미나고 맛있었다!!\n단란하다!!\n다음에는 못온사람들도 다같이 놀았으면 좋겠다!!',
    // 노션 원본 디스코드 채널(1307389108519305246)에서 실제로 받아온 사진 4장 — 단, 디스코드의
    // 서명된 CDN URL(?ex=...&is=...&hm=...)이라 ex 파라미터 만료 시각이 지나면 깨진다(2026-07
    // 무렵 만료 예상). 만료되면 placeholderImages(2, N)으로 되돌리거나 재다운로드해 영구 저장소
    // (Vercel Blob 등)에 다시 올려야 한다.
    images: [
      { id: 20, url: 'https://cdn.discordapp.com/attachments/1307389108519305246/1307389108968231015/IMG_2415.jpg?ex=6a51247d&is=6a4fd2fd&hm=36605126b2c054f126b9e6c383412dfa0fe9810f944c8f088b1ca5a76ea56058&', sortOrder: 0 },
      { id: 21, url: 'https://cdn.discordapp.com/attachments/1307389108519305246/1307389109505097728/IMG_2416.jpg?ex=6a51247d&is=6a4fd2fd&hm=839e7bfdb2787e05dbc4463b1e710320c121717ea3a062feca60320208829b37&', sortOrder: 1 },
      { id: 22, url: 'https://cdn.discordapp.com/attachments/1307389108519305246/1307389111526625351/IMG_2424.jpg?ex=6a51247e&is=6a4fd2fe&hm=a91830e121ea8637c114c4045bd317ef345a844cb74311b3ded00fa9495b5632&', sortOrder: 2 },
      { id: 23, url: 'https://cdn.discordapp.com/attachments/1307389108519305246/1307389112138989620/IMG_2413.jpg?ex=6a51247e&is=6a4fd2fe&hm=ad475c352aed873682c6a20d733d52930f7737ffdf97a2949b3ca12542aa6ab1&', sortOrder: 3 },
    ],
    participants: [
      { memberId: 6, name: '송혜정' },
      { memberId: 7, name: '김준수' },
      { memberId: 8, name: '신혜빈' },
      { memberId: 9, name: '안금서' },
      { memberId: 10, name: '정상희' },
    ],
  },
  {
    id: 3,
    date: '2025.01',
    tag: '행사',
    title: '리뷰어와의 만남',
    summary: '즐거웠습니다~',
    body: '즐거웠습니다~',
    images: placeholderImages(3, 2),
    participants: [
      { memberId: 1, name: '이승용' },
      { memberId: 4, name: '김범수' },
      { memberId: null, name: '김의천' },
    ],
  },
  {
    id: 4,
    date: '2025.01',
    tag: '행사',
    title: '2025 겨울 초록 밋업',
    summary: '2025.01.18(토) 겨울 초록 밋업! 다들 너무 멋졌어요.',
    body: '2025.01.18(토) 겨울 초록 밋업!\n다들 너무 멋졌어요. 다음에 또 봅시다~!',
    images: placeholderImages(4, 3),
    participants: [
      { memberId: 8, name: '신혜빈' },
      { memberId: 9, name: '안금서' },
      { memberId: 13, name: '신지훈' },
    ],
  },
  {
    id: 5,
    date: '2025.03',
    tag: '행사',
    title: '그리디 2기 OT',
    summary: '다들 반갑습니다~~!',
    body: '다들 반갑습니다~~!',
    images: placeholderImages(5, 2),
    participants: [
      { memberId: 15, name: '신지우' },
      { memberId: 16, name: '정창우' },
      { memberId: 17, name: '임규영' },
      { memberId: 18, name: '강동현' },
      { memberId: 19, name: '박찬빈' },
      { memberId: 20, name: '황혜림' },
      { memberId: 21, name: '허석준' },
      { memberId: 22, name: '전서희' },
      { memberId: 23, name: '이창희' },
      { memberId: 24, name: '김지우' },
      { memberId: 25, name: '염지환' },
    ],
  },
  {
    id: 6,
    date: '2025.05',
    tag: '행사',
    title: '그리디 중간총회',
    summary: '중간총회 참여해주신 분들 모두 감사합니다~!',
    body: '중간총회 참여해주신 분들 모두 감사합니다~!~!\n사람이 많아서 다같이 섞여 놀지는 못했지만, 그래도 즐거우셨죠? ㅎ_ㅎ',
    images: placeholderImages(6, 2),
    participants: [
      { memberId: 1, name: '이승용' },
      { memberId: 8, name: '신혜빈' },
      { memberId: 9, name: '안금서' },
      { memberId: 15, name: '신지우' },
      { memberId: 17, name: '임규영' },
    ],
  },
  {
    id: 7,
    date: '2025.05',
    tag: '축제',
    title: '0514 축제 부스 1일차 (2)',
    summary: '오픈부터 마감까지 고생 많으셨습니다. 첫날 수익 82,500원!',
    body: '오픈부터 마감까지 너무 고생 많으셨습니다~!~!~!!\n\n첫날에 생각보다 너무 인기가 많았네요.....\n\n첫날 성과는... 82,500원 수익을 올렸어요\n\n부스 봐준 모든 그리디 멤버들 너무 고생 많으셨고 앞으로 이틀 더 고생해 봅시다-!\n\n저녁에는 즐거운 축제 보내시길~',
    images: placeholderImages(7, 3),
    participants: [
      { memberId: 15, name: '신지우' },
      { memberId: 18, name: '강동현' },
      { memberId: 19, name: '박찬빈' },
      { memberId: 20, name: '황혜림' },
    ],
  },
  {
    id: 8,
    date: '2025.06',
    tag: '행사',
    title: '06/21 초록 밋업',
    summary: '그리디 2기와 함께한 초록 밋업!',
    body: '그리디 2기와 함께한 초록 밋업!',
    images: placeholderImages(8, 2),
    participants: [
      { memberId: 15, name: '신지우' },
      { memberId: 16, name: '정창우' },
      { memberId: 18, name: '강동현' },
    ],
  },
  {
    id: 9,
    date: '2025.08',
    tag: '데모데이',
    title: '1차 데모데이',
    summary: '2기가 그동안 만든 팀 프로젝트를 처음 선보인 자리.',
    body: '2기가 그동안 만든 팀 프로젝트를 처음 선보인 자리.',
    images: placeholderImages(9, 3),
    participants: [
      { memberId: 15, name: '신지우' },
      { memberId: 16, name: '정창우' },
      { memberId: 17, name: '임규영' },
      { memberId: 18, name: '강동현' },
    ],
  },
  {
    id: 10,
    date: '2025.09',
    tag: '행사',
    title: '25-09-03 그리디 3기 OT',
    summary: '3기의 시작을 알린 오리엔테이션.',
    body: '3기의 시작을 알린 오리엔테이션.',
    images: placeholderImages(10, 2),
    participants: [
      { memberId: 26, name: '윤재홍' },
      { memberId: 27, name: '심혁' },
      { memberId: 28, name: '강건' },
      { memberId: 29, name: '강예령' },
      { memberId: 30, name: '이고은' },
      { memberId: 31, name: '하수한' },
      { memberId: 32, name: '김태우' },
      { memberId: 33, name: '서현진' },
      { memberId: 34, name: '김하늘' },
    ],
  },
  {
    id: 11,
    date: '2025.09',
    tag: '행사',
    title: '2기 RM',
    summary: '2기 리뷰어와 만남',
    body: '2기 리뷰어와 만남',
    images: placeholderImages(11, 1),
    participants: [
      { memberId: 15, name: '신지우' },
      { memberId: 17, name: '임규영' },
      { memberId: null, name: '조상준' },
    ],
  },
  {
    id: 12,
    date: '2025.09',
    tag: '데모데이',
    title: '25-09-17 2기 최종 데모데이',
    summary: '6개월간의 2기 공식 활동 종료. 줍줍·슬종생 팀 모두 수고했어요.',
    body: '6개월간의 그리디 2기 공식 활동이 종료되었습니다.\n줍줍 팀과 슬종생 팀 모두 멋진 서비스 만들어 주셔서 고맙습니다! 앞으로도 그리디에서 멋진 활동 이어 가봐요~!',
    images: placeholderImages(12, 3),
    participants: [
      { memberId: 15, name: '신지우' },
      { memberId: 16, name: '정창우' },
      { memberId: 17, name: '임규영' },
      { memberId: 18, name: '강동현' },
      { memberId: 19, name: '박찬빈' },
      { memberId: 20, name: '황혜림' },
    ],
  },
  {
    id: 13,
    date: '2025.09',
    tag: '행사',
    title: '그리디 2기 MT',
    summary: '그리디 1기 2기 3기 리뷰어분들과 함께한 엠티 (feat 그리디 1주년 축하)',
    body: '250919 그리디 1기 2기 3기 리뷰어분들과 함께한 2기 엠티!!! (feat 그리디 1주년 축하)\n\n넘 재밌었습니다~ 다들 수고하셨어요',
    images: placeholderImages(13, 4),
    participants: [
      { memberId: 1, name: '이승용' },
      { memberId: 8, name: '신혜빈' },
      { memberId: 15, name: '신지우' },
      { memberId: 26, name: '윤재홍' },
      { memberId: null, name: '송은우' },
    ],
  },
  {
    id: 14,
    date: '2025.11',
    tag: '데모데이',
    title: '그리디콘',
    summary: '한 해를 되돌아보며 발표와 네트워킹을 함께한 컨퍼런스.',
    body: '한 해를 되돌아보며 발표와 네트워킹을 함께한 컨퍼런스.',
    images: placeholderImages(14, 4),
    participants: [
      { memberId: 1, name: '이승용' },
      { memberId: 18, name: '강동현' },
      { memberId: 26, name: '윤재홍' },
      { memberId: 27, name: '심혁' },
    ],
  },
  {
    id: 15,
    date: '2026.03',
    tag: '행사',
    title: '그리디 엠티',
    summary: '4기와 함께한 엠티.',
    body: '4기와 함께한 엠티.',
    images: placeholderImages(15, 5),
    participants: [
      { memberId: 26, name: '윤재홍' },
      { memberId: 27, name: '심혁' },
      { memberId: 37, name: '홍의민' },
      { memberId: 42, name: '강대현' },
    ],
  },
  {
    id: 16,
    date: '2026.05',
    tag: '축제',
    title: '모두 함께한 2026 축제 부스 운영 끝~',
    summary: '3일 동안 진행했던 축제 부스 운영이 잘 마무리되었습니다!',
    body: '3일 동안 진행했던 그리디 축제 부스 운영이 잘 마무리되었습니다!',
    images: placeholderImages(16, 3),
    participants: [
      { memberId: 37, name: '홍의민' },
      { memberId: 38, name: '김동건' },
      { memberId: 41, name: '김민욱' },
    ],
  },
  {
    id: 17,
    date: '2026.05',
    tag: '세션',
    title: '코수타',
    summary: '주말인데도 긴 시간 끝까지 함께한 코딩 수련 시간.',
    body: '오늘 코수타 다들 고생 많으셨습니다.\n주말인데도 긴 시간 끝까지 함께해주셔서 감사합니다.',
    // 노션 원본 디스코드 채널(1510228927879315666)에서 받아온 사진 3장 — id:2와 같은 이유로
    // 서명된 CDN URL이라 ex 파라미터 만료 시각이 지나면 깨진다. 만료되면 placeholderImages(17, N)
    // 으로 되돌리거나 재다운로드해 영구 저장소(Vercel Blob 등)에 다시 올려야 한다.
    images: [
      { id: 170, url: 'https://cdn.discordapp.com/attachments/1510228927879315666/1510228929284276304/KakaoTalk_20260530_192651886.jpg?ex=6a51728b&is=6a50210b&hm=6b52a58cee7ee29845aad9c6bf76e35055c33c61a6b1113bba434a904f9e9d25&', sortOrder: 0 },
      { id: 171, url: 'https://cdn.discordapp.com/attachments/1510228927879315666/1510228930609807480/KakaoTalk_20260530_192651886_01.jpg?ex=6a51728b&is=6a50210b&hm=199b8fc93604523b7b0e42169bd50b7b0b537e50c011241f63fd44cbc90143ca&', sortOrder: 1 },
      { id: 172, url: 'https://cdn.discordapp.com/attachments/1510228927879315666/1510228939358867556/KakaoTalk_20260530_192651886_02.jpg?ex=6a51728d&is=6a50210d&hm=2bc2a1d67112c95c952328d90f5fe979a4820d95453edf21bfa74a94611dad11&', sortOrder: 2 },
    ],
    participants: [
      { memberId: 26, name: '윤재홍' },
      { memberId: 27, name: '심혁' },
      { memberId: 35, name: '김민기' },
      { memberId: 36, name: '이진' },
    ],
  },
];
