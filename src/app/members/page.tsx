'use client';

import Link from 'next/link';
import { useState } from 'react';

type Track = 'all' | 'FE' | 'BE';

interface Person { n: string; t: 'FE' | 'BE'; r: string[] }

const PEOPLE: Person[] = [
  ...(['김민준', '이서연', '박지호', '최예린'] as const).map((n) => ({ n, t: 'FE' as const, r: ['멤버'] })),
  { n: '정우진', t: 'FE', r: ['리뷰어'] },
  { n: '한도윤', t: 'FE', r: ['리뷰어'] },
  { n: '오세찬', t: 'FE', r: ['리뷰어'] },
  { n: '배준서', t: 'FE', r: ['리뷰어'] },
  { n: '윤하준', t: 'FE', r: ['리뷰어', 'OB'] },
  { n: '강민서', t: 'FE', r: ['리드', '리뷰어', '메인테이너'] },
  ...(['임시우', '조하준', '신유나', '권태양', '문서윤', '배현우'] as const).map((n) => ({ n, t: 'BE' as const, r: ['멤버'] })),
  ...(['홍지우', '곽도현', '남시현', '백승호', '서지안', '고은채', '류현수', '차예준', '장유진'] as const).map((n) => ({
    n,
    t: 'BE' as const,
    r: ['리뷰어'],
  })),
];

const CHIP_CLS: Record<string, string> = {
  멤버: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300',
  리뷰어: 'bg-brand/10 text-brand',
  리드: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
  메인테이너: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
  OB: 'bg-slate-200 text-slate-500 dark:bg-white/10',
};

export default function MembersPage() {
  const [filter, setFilter] = useState<Track>('all');

  const visible = PEOPLE.filter((p) => filter === 'all' || p.t === filter);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">멤버</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300">공개 화면</span>
      </div>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        4기 구성원 · 카드를 누르면 개인 이력서로 이동합니다.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        {(['all', 'FE', 'BE'] as Track[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full ${filter === f ? 'bg-brand text-white' : 'bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10'}`}
          >
            {f === 'all' ? '전체' : f}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {visible.map((p) => (
          <Link
            key={p.n}
            href={`/members/${p.n}`}
            title={`${p.n} 이력서 보기`}
            className="flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-4 hover:-translate-y-0.5 transition"
          >
            <div className="w-11 h-11 rounded-full bg-slate-300 dark:bg-white/20 grid place-items-center font-bold shrink-0">
              {p.n[0]}
            </div>
            <div className="min-w-0">
              <div className="font-semibold">{p.n}</div>
              <div className="text-xs text-slate-500">{p.t} · 4기</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {p.r.map((r) => (
                  <span key={r} className={`text-[10px] px-1.5 py-0.5 rounded-full ${CHIP_CLS[r] ?? ''}`}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-400">
        실제 4기 명단 기준 — FE 멤버 4·리뷰어 6 / BE 멤버 6·리뷰어 9
      </p>
    </main>
  );
}
