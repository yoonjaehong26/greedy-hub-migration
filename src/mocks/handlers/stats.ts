import { http, HttpResponse } from 'msw';
import { STATS } from '../data/stats';

export const statsHandlers = [
  http.get('*/api/v1/stats', () => {
    return HttpResponse.json(STATS);
  }),
];
