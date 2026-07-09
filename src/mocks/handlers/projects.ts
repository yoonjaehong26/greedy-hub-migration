import { http, HttpResponse } from 'msw';
import { PROJECTS } from '../data/projects';

export const projectHandlers = [
  http.get('*/api/projects', () => {
    return HttpResponse.json({
      items: PROJECTS.map(({ id, name, cohortLabel, trackLabel, description, teamSize, thumbnailUrl, thumbnailColor }) => ({
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

  http.get('*/api/projects/:id', ({ params }) => {
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
