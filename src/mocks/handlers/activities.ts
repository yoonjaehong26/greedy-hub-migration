import { http, HttpResponse } from 'msw';
import { ACTIVITIES, CATEGORY_TO_TAGS } from '../data/activities';

export const activityHandlers = [
  http.get('*/api/v1/activities', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    let filtered = ACTIVITIES;
    if (category && category !== '전체') {
      const tags = CATEGORY_TO_TAGS[category] ?? [category];
      filtered = filtered.filter((a) => tags.includes(a.tag));
    }

    return HttpResponse.json({
      items: filtered.map(({ id, date, tag, title, summary, images, coverImageUrl }) => ({
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

  http.get('*/api/v1/activities/:id', ({ params }) => {
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
