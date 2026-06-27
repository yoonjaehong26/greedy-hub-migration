'use client';

import Link from 'next/link';
import { useState } from 'react';

const ITEMS = [
  { date: '2026.05', tag: '행사', cat: '행사', title: '4기 MT — 1박 2일', desc: '4기가 처음으로 함께한 엠티. 게임하고 밤새 코드 얘기하고.', imgs: 3 },
  { date: '2026.04', tag: '세션', cat: '세션', title: 'React 심화 세션', desc: '상태관리·렌더링 최적화를 대면 스터디로 정리한 날.', imgs: 2 },
  { date: '2026.03', tag: '행사', cat: '행사', title: '4기 OT & 아이스브레이킹', desc: '새 기수의 시작. 트랙 소개와 커리큘럼 안내.', imgs: 2 },
  { date: '2025.11', tag: '데모데이', cat: '데모데이', title: '3기 프로젝트 데모데이', desc: '한 학기 팀 프로젝트를 발표하고 피드백을 나눈 자리.', imgs: 3 },
  { date: '2025.05', tag: '축제', cat: '행사', title: '세종대 축제 부스 운영', desc: '직접 만든 웹 게임으로 부스를 운영했어요.', imgs: 3 },
  { date: '2024.03', tag: '창립', cat: '행사', title: '그리디 시작', desc: '개발에 진심인 사람들이 모여 그리디를 만들었습니다.', imgs: 1 },
];

const TAG_CLS: Record<string, string> = {
  행사: 'bg-brand/10 text-brand',
  세션: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300',
  데모데이: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
  축제: 'bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300',
  창립: 'bg-slate-200 text-slate-600 dark:bg-white/10',
};

const GRADS = ['from-brand/40', 'from-emerald-400/40', 'from-amber-400/40', 'from-rose-400/40', 'from-violet-400/40', 'from-cyan-400/40'];

type Cat = '전체' | '행사' | '세션' | '데모데이';

export default function GalleryPage() {
  const [filter, setFilter] = useState<Cat>('전체');

  const visible = ITEMS.filter((it) => filter === '전체' || it.cat === filter);

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
        {(['전체', '행사', '세션', '데모데이'] as Cat[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full ${filter === f ? 'bg-brand text-white' : 'bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <ol className="mt-8 relative border-s-2 border-slate-200 dark:border-white/10 ml-2 space-y-8">
        {visible.map((it, gi) => (
          <li key={it.title} className="ms-6">
            <span className="absolute -start-[9px] w-4 h-4 rounded-full bg-brand ring-4 ring-slate-50 dark:ring-slate-900" />
            <div className="flex items-center gap-2 mb-2">
              <time className="text-sm font-semibold text-slate-500">{it.date}</time>
              <span className={`text-xs px-2 py-0.5 rounded-full ${TAG_CLS[it.tag] ?? ''}`}>{it.tag}</span>
            </div>
            <Link
              href="/gallery/1"
              className="block rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-4 hover:-translate-y-0.5 transition"
            >
              <h3 className="font-semibold">{it.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{it.desc}</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {Array.from({ length: it.imgs }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-[4/3] rounded-lg bg-gradient-to-br ${GRADS[(gi + i) % GRADS.length]} to-slate-200 dark:to-slate-700`}
                  />
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
