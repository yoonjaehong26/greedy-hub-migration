'use client';

import Link from 'next/link';
import { useActivityQuery } from '@/shared/core/queries/activityQueries';

const TAG_CLS: Record<string, string> = {
  행사: 'bg-brand/10 text-brand',
  세션: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300',
  데모데이: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
  축제: 'bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300',
  창립: 'bg-slate-200 text-slate-600 dark:bg-white/10',
};

export function ActivityDetail({ id }: { id: string }) {
  const { data: activity, isLoading, isError } = useActivityQuery(id);

  if (isLoading) {
    return <main className="mx-auto max-w-4xl px-5 py-10 text-sm text-slate-500 text-center">불러오는 중…</main>;
  }

  if (isError || !activity) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-10">
        <Link href="/gallery" className="text-sm text-slate-500 hover:text-brand">
          ← 활동 타임라인
        </Link>
        <p className="mt-6 text-sm text-red-500">활동을 찾을 수 없습니다.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex items-center justify-between gap-3">
        <Link href="/gallery" className="text-sm text-slate-500 hover:text-brand">
          ← 활동 타임라인
        </Link>
        <Link
          href={`/gallery/${activity.id}/edit`}
          className="px-3 py-2 rounded-lg text-sm font-semibold ring-1 ring-slate-900/10 dark:ring-white/15"
        >
          편집
        </Link>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <time className="text-sm font-semibold text-slate-500">{activity.date}</time>
        <span className={`text-xs px-2 py-0.5 rounded-full ${TAG_CLS[activity.tag] ?? ''}`}>{activity.tag}</span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">{activity.title}</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300">공개 화면</span>
      </div>

      {activity.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={activity.coverImageUrl}
          alt=""
          className="mt-5 aspect-[16/7] rounded-2xl object-cover w-full"
        />
      )}

      <article className="mt-6 space-y-3 leading-relaxed text-slate-700 dark:text-slate-300">
        {activity.body.split('\n\n').map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      {activity.participants.length > 0 && (
        <>
          <h2 className="mt-8 mb-3 font-bold">함께한 멤버</h2>
          <div className="flex flex-wrap gap-2">
            {activity.participants.map((p) => (
              <Link
                key={`${p.memberId}-${p.name}`}
                href={`/members/${p.memberId ?? p.name}`}
                className="inline-flex items-center gap-1 text-sm px-2.5 py-1 rounded-full bg-brand/10 text-brand hover:bg-brand/20"
              >
                @{p.name}
              </Link>
            ))}
          </div>
        </>
      )}

      {activity.images.length > 0 && (
        <>
          <h2 className="mt-8 mb-3 font-bold">사진</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {activity.images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.id}
                src={img.url}
                alt=""
                className="aspect-[4/3] rounded-xl object-cover w-full"
              />
            ))}
          </div>
        </>
      )}

      <p className="mt-6 text-xs text-slate-400">
        사진·내용 추가는 멤버도 가능합니다. 편집·정리(대표 사진 지정·삭제)는 운영진이 합니다.
      </p>
    </main>
  );
}
