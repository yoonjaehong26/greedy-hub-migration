import { http, HttpResponse } from 'msw';
import { STATS } from '../data/stats';

export const statsHandlers = [
  http.get('*/api/stats', () => {
    return HttpResponse.json(STATS);
  }),
];
