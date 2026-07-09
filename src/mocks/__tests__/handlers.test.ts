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
  it('필터 없이 전체 목록을 반환한다', async () => {
    const res = await fetch(`${BASE}/members`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.some((m: { track: string }) => m.track === 'FE')).toBe(true);
    expect(body.items.some((m: { track: string }) => m.track === 'BE')).toBe(true);
    expect(body.items[0]).toMatchObject({
      id: expect.any(Number),
      login: expect.any(String),
      name: expect.any(String),
      track: expect.stringMatching(/^(FE|BE)$/),
      cohort: expect.any(Number),
      roles: expect.any(Array),
    });
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
