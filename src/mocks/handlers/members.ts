import { http, HttpResponse } from 'msw';
import { MEMBERS } from '../data/members';

export const memberHandlers = [
  http.get('*/api/v1/members', ({ request }) => {
    const url = new URL(request.url);
    const track = url.searchParams.get('track');
    const cohort = url.searchParams.get('cohort');

    let filtered = MEMBERS;
    if (track) filtered = filtered.filter((m) => m.track === track);
    if (cohort) filtered = filtered.filter((m) => m.cohort === Number(cohort));

    return HttpResponse.json({
      items: filtered.map(({ id, login, name, track: t, cohort: c, roles, avatarUrl }) => ({
        id,
        login,
        name,
        track: t,
        cohort: c,
        roles,
        avatarUrl,
      })),
    });
  }),

  http.get('*/api/v1/members/:id', ({ params }) => {
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
      stats: member.stats ?? { completedMissions: 0, teamProjects: 0, blogPosts: 0 },
      teamProjects: member.teamProjects ?? [],
      activities: member.activities ?? [],
    });
  }),
];
