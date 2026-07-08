import { http, HttpResponse } from 'msw';
import { PROJECTS } from '../data/projects';

export const projectHandlers = [
  http.get('*/api/v1/projects', ({ request }) => {
    const url = new URL(request.url);
    const filter = url.searchParams.get('filter');

    let filtered = PROJECTS;
    if (filter && filter !== '전체') {
      filtered = filtered.filter((p) => p.cohortLabel === filter || p.trackLabel === filter);
    }

    return HttpResponse.json({
      items: filtered.map(({ id, name, cohortLabel, trackLabel, description, teamSize, thumbnailUrl, thumbnailColor }) => ({
        id,
        name,
        cohortLabel,
        trackLabel,
        description,
        teamSize,
        thumbnailUrl,
        thumbnailColor,
      })),
    });
  }),

  http.get('*/api/v1/projects/:id', ({ params }) => {
    const { id } = params;
    const project = PROJECTS.find((p) => String(p.id) === id);

    if (!project) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: '프로젝트를 찾을 수 없습니다.' } },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      ...project,
      team: project.team ?? [],
      stack: project.stack ?? [],
    });
  }),
];
