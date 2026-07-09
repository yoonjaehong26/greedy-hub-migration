'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useActivitiesQuery } from '@/shared/core/queries/activityQueries';
import { CATEGORY_TO_TAGS } from './categoryFilter';

const TAG_CLS: Record<string, string> = {
  행사: 'bg-brand/10 text-brand',
  세션: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300',
  데모데이: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
  축제: 'bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300',
  창립: 'bg-slate-200 text-slate-600 dark:bg-white/10',
};

type Category = '전체' | '행사' | '세션' | '데모데이';

export function ActivityTimeline() {
  const [category, setCategory] = useState<Category>('전체');
  const { data: activities = [], isLoading, isError } = useActivitiesQuery();

  const visible =
    category === '전체'
      ? activities
      : activities.filter((a) => (CATEGORY_TO_TAGS[category] ?? [category]).includes(a.tag));

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold">활동 타임라인</h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300">공개 화면</span>
          </div>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            그리디가 함께한 순간들 — 사진과 한 줄로 남기는 기록.
          </p>
        </div>
        <Link
          href="/gallery/edit"
          className="px-4 py-2 rounded-lg bg-brand text-white font-semibold text-sm"
        >
          + 활동 올리기
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        {(['전체', '행사', '세션', '데모데이'] as Category[]).map((f) => (
          <button
            key={f}
            onClick={() => setCategory(f)}
            className={`px-3 py-1.5 rounded-full ${category === f ? 'bg-brand text-white' : 'bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-10 text-sm text-slate-500 text-center py-10">불러오는 중…</p>
      ) : isError ? (
        <p className="mt-10 text-sm text-red-500 text-center py-10">활동 목록을 가져오지 못했습니다.</p>
      ) : (
        <ol className="mt-8 relative border-s-2 border-slate-200 dark:border-white/10 ml-2 space-y-8">
          {visible.map((a) => (
            <li key={a.id} className="ms-6">
              <span className="absolute -start-[9px] w-4 h-4 rounded-full bg-brand ring-4 ring-slate-50 dark:ring-slate-900" />
              <div className="flex items-center gap-2 mb-2">
                <time className="text-sm font-semibold text-slate-500">{a.date}</time>
                <span className={`text-xs px-2 py-0.5 rounded-full ${TAG_CLS[a.tag] ?? ''}`}>{a.tag}</span>
              </div>
              <Link
                href={`/gallery/${a.id}`}
                className="block rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-4 hover:-translate-y-0.5 transition"
              >
                <h3 className="font-semibold">{a.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{a.summary}</p>
                {a.thumbnailUrls.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {a.thumbnailUrls.map((url, i) => {
                      const isLast = i === a.thumbnailUrls.length - 1;
                      const remaining = a.imageCount - a.thumbnailUrls.length;
                      return (
                        <div key={url} className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt=""
                            className="aspect-[4/3] rounded-lg object-cover w-full"
                          />
                          {isLast && remaining > 0 && (
                            <span className="absolute inset-0 rounded-lg bg-black/50 text-white text-sm font-semibold grid place-items-center">
                              +{remaining}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
