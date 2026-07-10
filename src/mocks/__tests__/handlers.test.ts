/**
 * handlers.test.ts — MSW 목서버 계약 테스트
 *
 * 브라우저 서비스워커 없이 msw/node로 각 GET 엔드포인트가 docs/backend-api-spec.md와
 * 합의한 응답 형태를 그대로 반환하는지 확인한다.
 * 필터링(track·category 등)은 서버가 아닌 프론트에서 클라이언트 사이드로 처리 —
 * 이 목서버는 항상 전체 목록을 반환한다.
 */
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { server } from '../server';

const BASE = 'http://localhost/api';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('GET /members', () => {
  it('필터 없이 전체 목록을 반환하고 memberships[]로 소속을 담는다', async () => {
    const res = await fetch(`${BASE}/members`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.items)).toBe(true);
    const hasTrack = (track: string) =>
      body.items.some((m: { memberships: { track: string }[] }) =>
        m.memberships.some((ms) => ms.track === track),
      );
    expect(hasTrack('FE')).toBe(true);
    expect(hasTrack('BE')).toBe(true);
    expect(body.items[0]).toMatchObject({
      id: expect.any(Number),
      login: expect.any(String),
      name: expect.any(String),
      memberships: expect.any(Array),
    });
  });

  it('여러 기수에 걸친 멤버는 memberships에 여러 항목을 갖는다', async () => {
    const res = await fetch(`${BASE}/members`);
    const body = await res.json();
    const kang = body.items.find((m: { login: string }) => m.login === 'mintcoke123');
    expect(kang.memberships).toHaveLength(2);
    expect(kang.memberships.map((ms: { cohort: number }) => ms.cohort)).toEqual([2, 3]);
  });
});

describe('GET /members/:id', () => {
  it('로그인 슬러그로 상세를 반환한다', async () => {
    const res = await fetch(`${BASE}/members/yoonjaehong26`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('윤재홍');
    expect(body.stats).toEqual({ completedMissions: 0, teamProjects: 0, blogPosts: 0 });
    expect(body.teamProjects).toEqual([]);
  });

  it('없는 id면 404를 반환한다', async () => {
    const res = await fetch(`${BASE}/members/no-such-member`);
    expect(res.status).toBe(404);
  });
});

describe('GET /projects', () => {
  it('필터 없이 전체 목록을 반환한다', async () => {
    const res = await fetch(`${BASE}/projects`);
    const body = await res.json();
    expect(body.items.length).toBe(6);
  });

  it('상세는 team·stack을 포함한다', async () => {
    const res = await fetch(`${BASE}/projects/1`);
    const body = await res.json();
    expect(body.name).toBe('모꼬지');
    expect(body.team.length).toBeGreaterThan(0);
    expect(body.stack).toContain('Next.js');
  });
});

describe('GET /curriculum', () => {
  it('필터 없이 두 트랙 전체 주차를 반환한다', async () => {
    const res = await fetch(`${BASE}/curriculum`);
    const body = await res.json();
    expect(body.items.some((w: { track: string }) => w.track === 'FE')).toBe(true);
    expect(body.items.some((w: { track: string }) => w.track === 'BE')).toBe(true);
  });

  it('트랙별로 weekNo 오름차순이다', async () => {
    const res = await fetch(`${BASE}/curriculum`);
    const body = await res.json();
    const feWeekNos = body.items
      .filter((w: { track: string }) => w.track === 'FE')
      .map((w: { weekNo: number }) => w.weekNo);
    expect(feWeekNos).toEqual([...feWeekNos].sort((a, b) => a - b));
  });
});

describe('GET /activities', () => {
  it('필터 없이 전체 목록을 반환한다 (축제·창립 포함)', async () => {
    const res = await fetch(`${BASE}/activities`);
    const body = await res.json();
    expect(body.items.length).toBe(6);
    const titles = body.items.map((a: { title: string }) => a.title);
    expect(titles).toContain('세종대 축제 부스 운영');
    expect(titles).toContain('그리디 시작');
  });

  it('date 내림차순으로 정렬된다', async () => {
    const res = await fetch(`${BASE}/activities`);
    const body = await res.json();
    const dates = body.items.map((a: { date: string }) => a.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('thumbnailUrls는 항상 imageCount 이하·최대 3장이다', async () => {
    const res = await fetch(`${BASE}/activities`);
    const body = await res.json();
    body.items.forEach((a: { imageCount: number; thumbnailUrls: string[] }) => {
      expect(a.thumbnailUrls.length).toBeLessThanOrEqual(3);
      expect(a.thumbnailUrls.length).toBeLessThanOrEqual(a.imageCount);
    });
  });

  it('사진이 3장보다 많으면 3장으로 잘리고 sortOrder 순으로 온다', async () => {
    const res = await fetch(`${BASE}/activities`);
    const body = await res.json();
    // id=1(4기 MT)은 실제 이미지 5장 — 목록엔 앞 3장만
    const mt = body.items.find((a: { id: number }) => a.id === 1);
    expect(mt.imageCount).toBe(5);
    expect(mt.thumbnailUrls).toHaveLength(3);
    expect(mt.thumbnailUrls[0]).toContain('greedy-activity-1-0');
    expect(mt.thumbnailUrls[2]).toContain('greedy-activity-1-2');
  });

  it('상세는 images·participants를 포함하고 images는 sortOrder 순이다', async () => {
    const res = await fetch(`${BASE}/activities/1`);
    const body = await res.json();
    expect(body.images.length).toBe(5);
    const orders = body.images.map((img: { sortOrder: number }) => img.sortOrder);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(body.participants).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: '박지호' })]),
    );
  });
});

describe('GET /stats', () => {
  it('홈 통계를 반환한다', async () => {
    const res = await fetch(`${BASE}/stats`);
    const body = await res.json();
    expect(body).toEqual({ totalMembers: 50, activeCohort: 4, tracks: 'FE · BE', teamProjects: 12 });
  });
});
