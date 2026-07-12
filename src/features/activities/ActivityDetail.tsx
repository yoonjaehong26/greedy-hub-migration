'use client';

import Link from 'next/link';
import { useActivitiesQuery, useActivityQuery } from '@/shared/core/queries/activityQueries';
import { Badge } from '@/shared/components/ui/Badge';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { Avatar } from '@/shared/components/ui/Avatar';

const MAX_AVATARS = 4;
const GALLERY_TILE_COUNT = 4;

export function ActivityDetail({ id }: { id: string }) {
  const { data: activity, isLoading, isError } = useActivityQuery(id);
  const { data: activities = [] } = useActivitiesQuery();

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-10 text-center text-sm text-neutral-500">
        불러오는 중…
      </main>
    );
  }

  if (isError || !activity) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-10">
        <Link href="/gallery" className="text-sm font-semibold text-brand">
          ← 활동으로
        </Link>
        <p className="mt-6 text-sm text-red-500">활동을 찾을 수 없습니다.</p>
      </main>
    );
  }

  const currentIndex = activities.findIndex((a) => a.id === activity.id);
  const prevActivity = currentIndex >= 0 ? activities[currentIndex + 1] : undefined;
  const nextActivity = currentIndex > 0 ? activities[currentIndex - 1] : undefined;

  const [heroImage, ...restImages] = activity.images;
  const hasOverflow = restImages.length > GALLERY_TILE_COUNT - 1;
  const galleryTiles = hasOverflow ? restImages.slice(0, GALLERY_TILE_COUNT - 1) : restImages;
  const overflowCount = restImages.length - galleryTiles.length;

  const shownParticipants = activity.participants.slice(0, MAX_AVATARS);
  const remainingParticipants = activity.participants.length - shownParticipants.length;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <Link href="/gallery" className="text-sm font-semibold text-brand">
        ← 활동으로
      </Link>

      <div className="mt-4">
        <Badge variant="outline">{activity.tag}</Badge>
      </div>

      <h1 className="mt-3 text-3xl font-bold text-neutral-900 md:text-4xl">{activity.title}</h1>
      <p className="mt-2 text-sm text-neutral-500">{activity.date}</p>

      {activity.participants.length > 0 && (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center">
            {shownParticipants.map((p) =>
              p.memberId ? (
                <Link
                  key={p.memberId}
                  href={`/members/${p.memberId}`}
                  title={p.name}
                  className="-mr-2 last:mr-0 hover:z-10"
                >
                  <Avatar name={p.name} className="border-2 border-white" />
                </Link>
              ) : (
                <div key={p.name} title={p.name} className="-mr-2 last:mr-0">
                  <Avatar name={p.name} className="border-2 border-white" />
                </div>
              )
            )}
          </div>
          {remainingParticipants > 0 && (
            <p className="text-[13px] text-neutral-500">
              외 {remainingParticipants}명이 함께했어요
            </p>
          )}
        </div>
      )}

      {heroImage && (
        <div className="mt-6">
          <ImagePlaceholder
            src={heroImage.url}
            alt={activity.title}
            className="!aspect-[16/9] md:!aspect-[16/7]"
          />
        </div>
      )}

      <article className="mt-8 space-y-4 text-base leading-relaxed text-neutral-700">
        {activity.body.split('\n\n').map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      {restImages.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-neutral-900">사진</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {galleryTiles.map((img) => (
              <ImagePlaceholder key={img.id} src={img.url} alt="" className="!aspect-square" />
            ))}
            {hasOverflow && (
              <div className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl bg-neutral-900 text-white">
                <p className="text-xl font-bold">+{overflowCount}</p>
                <p className="text-[13px] text-neutral-300">모두 보기</p>
              </div>
            )}
          </div>
        </div>
      )}

      {(prevActivity || nextActivity) && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {prevActivity && (
            <Link
              href={`/gallery/${prevActivity.id}`}
              className="flex flex-col gap-1 rounded-xl bg-neutral-50 p-5 hover:bg-neutral-100"
            >
              <span className="text-xs text-neutral-500">← 이전 활동</span>
              <span className="text-base font-semibold text-neutral-900">
                {prevActivity.title}
              </span>
            </Link>
          )}
          {nextActivity && (
            <Link
              href={`/gallery/${nextActivity.id}`}
              className="flex flex-col items-end gap-1 rounded-xl bg-neutral-50 p-5 text-right hover:bg-neutral-100 sm:col-start-2"
            >
              <span className="text-xs text-neutral-500">다음 활동 →</span>
              <span className="text-base font-semibold text-neutral-900">
                {nextActivity.title}
              </span>
            </Link>
          )}
        </div>
      )}

      <p className="mt-8 text-xs text-neutral-400">
        사진·내용 추가는 멤버도 가능합니다. 편집·정리(대표 사진 지정·삭제)는 운영진이 합니다.
      </p>
    </main>
  );
}
