import { http, HttpResponse } from 'msw';
import { CURRICULUM_WEEKS } from '../data/study';

export const studyHandlers = [
  http.get('*/api/v1/study/curriculum', ({ request }) => {
    const url = new URL(request.url);
    const track = url.searchParams.get('track') ?? 'FE';

    const weeks = CURRICULUM_WEEKS.filter((w) => w.track === track).sort((a, b) => a.weekNo - b.weekNo);

    return HttpResponse.json({ track, weeks });
  }),
];
