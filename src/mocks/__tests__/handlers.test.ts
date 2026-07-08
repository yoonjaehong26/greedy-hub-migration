/**
 * handlers.test.ts — MSW 목서버 계약 테스트
 *
 * 브라우저 서비스워커 없이 msw/node로 각 GET 엔드포인트가 docs/backend-api-spec.md와
 * 합의한 응답 형태를 그대로 반환하는지 확인한다.
 */
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { server } from '../server';

const BASE = 'http://localhost/api/v1';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('GET /members', () => {
  it('목록을 반환한다', async () => {
    const res = await fetch(`${BASE}/members`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeGreaterThan(0);
    expect(body.items[0]).toMatchObject({
      id: expect.any(Number),
      login: expect.any(String),
      name: expect.any(String),
      track: expect.stringMatching(/^(FE|BE)$/),
      cohort: expect.any(Number),
      roles: expect.any(Array),
    });
  });

  it('track 필터가 동작한다', async () => {
    const res = await fetch(`${BASE}/members?track=BE`);
    const body = await res.json();
    expect(body.items.every((m: { track: string }) => m.track === 'BE')).toBe(true);
  });
});

describe('GET /members/:id', () => {
  it('로그인 슬러그로 상세를 반환한다', async () => {
    const res = await fetch(`${BASE}/members/jiho-park`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('박지호');
    expect(body.stats.completedMissions).toBe(5);
    expect(body.teamProjects).toHaveLength(1);
  });

  it('없는 id면 404를 반환한다', async () => {
    const res = await fetch(`${BASE}/members/no-such-member`);
    expect(res.status).toBe(404);
  });
});

describe('GET /projects', () => {
  it('목록을 반환한다', async () => {
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

describe('GET /study/curriculum', () => {
  it('트랙별 주차를 weekNo 순으로 반환한다', async () => {
    const res = await fetch(`${BASE}/study/curriculum?track=FE`);
    const body = await res.json();
    expect(body.track).toBe('FE');
    const weekNos = body.weeks.map((w: { weekNo: number }) => w.weekNo);
    expect(weekNos).toEqual([...weekNos].sort((a, b) => a - b));
  });
});

describe('GET /activities', () => {
  it('전체 목록을 반환한다', async () => {
    const res = await fetch(`${BASE}/activities`);
    const body = await res.json();
    expect(body.items.length).toBe(6);
  });

  it('category=행사 필터에 축제·창립도 포함된다', async () => {
    const res = await fetch(`${BASE}/activities?category=행사`);
    const body = await res.json();
    const titles = body.items.map((a: { title: string }) => a.title);
    expect(titles).toContain('세종대 축제 부스 운영');
    expect(titles).toContain('그리디 시작');
  });

  it('상세는 images·participants를 포함한다', async () => {
    const res = await fetch(`${BASE}/activities/1`);
    const body = await res.json();
    expect(body.images.length).toBe(3);
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
