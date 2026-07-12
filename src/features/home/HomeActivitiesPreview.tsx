'use client';

import Link from 'next/link';
import { useActivitiesQuery } from '@/shared/core/queries/activityQueries';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';

export function HomeActivitiesPreview() {
  const { data: activities = [], isLoading } = useActivitiesQuery();
  const preview = activities.slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-slate-100">활동</h2>
        <Link href="/gallery" className="text-sm font-semibold text-brand">
          더보기
        </Link>
      </div>
      {isLoading ? (
        <p className="text-sm text-neutral-500">불러오는 중…</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {preview.map((a) => (
            <Link key={a.id} href={`/gallery/${a.id}`} className="flex flex-col gap-2">
              <ImagePlaceholder src={a.thumbnailUrls[0]} alt={a.title} />
              <p className="text-[13px] text-neutral-500 dark:text-slate-400">{a.title}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
