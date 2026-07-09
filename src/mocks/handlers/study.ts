import { http, HttpResponse } from 'msw';
import { CURRICULUM_WEEKS } from '../data/study';

export const studyHandlers = [
  http.get('*/api/curriculum', () => {
    const weeks = [...CURRICULUM_WEEKS].sort((a, b) => a.track.localeCompare(b.track) || a.weekNo - b.weekNo);
    return HttpResponse.json({ items: weeks });
  }),
];
