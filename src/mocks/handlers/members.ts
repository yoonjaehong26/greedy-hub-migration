import { http, HttpResponse } from 'msw';
import { MEMBERS } from '../data/members';

export const memberHandlers = [
  http.get('*/api/members', () => {
    return HttpResponse.json({
      items: MEMBERS.map(({ id, login, name, memberships, avatarUrl, missionDashboardUrl }) => ({
        id,
        login,
        name,
        memberships,
        avatarUrl,
        missionDashboardUrl,
      })),
    });
  }),

  http.get('*/api/members/:id', ({ params }) => {
    const { id } = params;
    const member = MEMBERS.find((m) => String(m.id) === id || m.login === id);

    if (!member) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: '멤버를 찾을 수 없습니다.' } },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      ...member,
      bio: member.bio ?? null,
      isPublic: member.isPublic ?? true,
      stats: member.stats ?? { completedMissions: 0, teamProjects: 0, blogPosts: 0 },
      completedMissions: member.completedMissions ?? [],
      blogPosts: member.blogPosts ?? [],
      teamProjects: member.teamProjects ?? [],
      activities: member.activities ?? [],
    });
  }),

  http.patch('*/api/members/:id', async ({ params, request }) => {
    const { id } = params;
    const member = MEMBERS.find((m) => String(m.id) === id || m.login === id);

    if (!member) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: '멤버를 찾을 수 없습니다.' } },
        { status: 404 },
      );
    }

    const payload = (await request.json()) as { bio?: string; isPublic?: boolean };
    if (payload.bio !== undefined) member.bio = payload.bio;
    if (payload.isPublic !== undefined) member.isPublic = payload.isPublic;

    return HttpResponse.json({
      ...member,
      bio: member.bio ?? null,
      isPublic: member.isPublic ?? true,
      stats: member.stats ?? { completedMissions: 0, teamProjects: 0, blogPosts: 0 },
      completedMissions: member.completedMissions ?? [],
      blogPosts: member.blogPosts ?? [],
      teamProjects: member.teamProjects ?? [],
      activities: member.activities ?? [],
    });
  }),
];
