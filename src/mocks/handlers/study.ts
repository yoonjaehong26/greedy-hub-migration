import { http, HttpResponse } from 'msw';
import { CURRICULUM_STAGES, CURRICULUM_TRACK_INTROS } from '../data/study';

export const studyHandlers = [
  http.get('*/api/curriculum', () => {
    const stages = [...CURRICULUM_STAGES].sort((a, b) => a.track.localeCompare(b.track) || a.order - b.order);
    return HttpResponse.json({ items: stages, trackIntros: CURRICULUM_TRACK_INTROS });
  }),
];
