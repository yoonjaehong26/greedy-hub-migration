'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useActivitiesQuery } from '@/shared/core/queries/activityQueries';
import { Chip } from '@/shared/components/ui/Chip';
import { Badge } from '@/shared/components/ui/Badge';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { CATEGORY_TO_TAGS } from './categoryFilter';

type Category = '전체' | '행사' | '세션' | '데모데이';

const CATEGORIES: Category[] = ['전체', '행사', '세션', '데모데이'];

export function ActivityTimeline() {
  const [category, setCategory] = useState<Category>('전체');
  const { data: activities = [], isLoading, isError } = useActivitiesQuery();

  const visible =
    category === '전체'
      ? activities
      : activities.filter((a) => (CATEGORY_TO_TAGS[category] ?? [category]).includes(a.tag));

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">활동</h1>
          <p className="text-base text-neutral-500">
            행사, 엠티, 데모데이까지 함께한 순간을 기록해요.
          </p>
        </div>
        <Button href="/gallery/edit" variant="outline" size="sm">
          + 활동 올리기
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Chip key={c} selected={category === c} onClick={() => setCategory(c)}>
            {c}
          </Chip>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-12 py-10 text-center text-sm text-neutral-500">불러오는 중…</p>
      ) : isError ? (
        <p className="mt-12 py-10 text-center text-sm text-red-500">
          활동 목록을 가져오지 못했습니다.
        </p>
      ) : visible.length === 0 ? (
        <p className="mt-12 py-10 text-center text-sm text-neutral-500">
          해당 카테고리의 활동이 없어요.
        </p>
      ) : (
        <ol className="mt-10 flex flex-col gap-6">
          {visible.map((a, i) => {
            const isLastItem = i === visible.length - 1;
            const remaining = a.imageCount - a.thumbnailUrls.length;

            return (
              <li key={a.id} className="flex gap-4 sm:gap-6">
                <div className="flex w-16 shrink-0 justify-end pt-1 sm:w-[90px]">
                  <time className="text-sm text-neutral-500">{a.date}</time>
                </div>
                <div className="flex shrink-0 flex-col items-center">
                  <span className="size-3 shrink-0 rounded-full bg-brand" />
                  {!isLastItem && <span className="mt-1 w-0.5 flex-1 bg-neutral-200" />}
                </div>
                <Link href={`/gallery/${a.id}`} className="min-w-0 flex-1 pb-6">
                  <Card className="transition hover:border-brand/40">
                    <Badge variant="outline">{a.tag}</Badge>
                    <h3 className="mt-2.5 text-lg font-semibold text-neutral-900">{a.title}</h3>
                    <p className="mt-1 text-sm text-neutral-500">{a.summary}</p>
                    {a.thumbnailUrls.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {a.thumbnailUrls.map((url, idx) => {
                          const isLastThumb = idx === a.thumbnailUrls.length - 1;
                          return (
                            <div
                              key={url}
                              className={`relative ${idx > 0 ? 'hidden sm:block' : ''}`}
                            >
                              <ImagePlaceholder src={url} alt={a.title} />
                              {isLastThumb && remaining > 0 && (
                                <span className="absolute inset-0 hidden items-center justify-center rounded-xl bg-black/50 text-sm font-semibold text-white sm:grid">
                                  +{remaining}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}
