import { http, HttpResponse } from 'msw';
import { MEMBERS } from '../data/members';

export const memberHandlers = [
  http.get('*/api/members', () => {
    return HttpResponse.json({
      items: MEMBERS.map(({ id, login, name, track, cohort, roles, avatarUrl }) => ({
        id,
        login,
        name,
        track,
        cohort,
        roles,
        avatarUrl,
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
      stats: member.stats ?? { completedMissions: 0, teamProjects: 0, blogPosts: 0 },
      teamProjects: member.teamProjects ?? [],
      activities: member.activities ?? [],
    });
  }),
];
