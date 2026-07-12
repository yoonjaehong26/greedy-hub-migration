import { http, HttpResponse } from 'msw';
import { ACTIVITIES } from '../data/activities';

export const activityHandlers = [
  http.get('*/api/activities', () => {
    const sorted = [...ACTIVITIES].sort((a, b) => b.date.localeCompare(a.date));

    return HttpResponse.json({
      items: sorted.map(({ id, date, tag, cohort, title, summary, images }) => ({
        id,
        date,
        tag,
        cohort,
        title,
        summary,
        imageCount: images.length,
        thumbnailUrls: [...images]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .slice(0, 3)
          .map((img) => img.url),
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

    return HttpResponse.json({
      ...activity,
      images: [...activity.images].sort((a, b) => a.sortOrder - b.sortOrder),
    });
  }),
];
