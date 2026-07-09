import { http, HttpResponse } from 'msw';
import { ACTIVITIES } from '../data/activities';

export const activityHandlers = [
  http.get('*/api/activities', () => {
    return HttpResponse.json({
      items: ACTIVITIES.map(({ id, date, tag, title, summary, images, coverImageUrl }) => ({
        id,
        date,
        tag,
        title,
        summary,
        imageCount: images.length,
        thumbnailUrl: coverImageUrl ?? images[0]?.url ?? null,
      })),
    });
  }),

  http.get('*/api/activities/:id', ({ params }) => {
    const { id } = params;
    const activity = ACTIVITIES.find((a) => String(a.id) === id);

    if (!activity) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: '활동을 찾을 수 없습니다.' } },
        { status: 404 },
      );
    }

    return HttpResponse.json(activity);
  }),
];
