'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MissionDetailPage() {
  const [reflected, setReflected] = useState(false);

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/missions" className="text-sm text-slate-500 hover:text-brand">
        ← 미션 목록
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs px-2 py-1 rounded-full bg-brand/10 text-brand font-medium">FE · 6주차</span>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-200 dark:bg-white/10">adv-2.1</span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">상태관리 심화 — Zustand</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">멤버 화면</span>
      </div>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        전역 상태 도구를 직접 선택하고, 그 근거를 설명할 수 있어야 합니다.
      </p>

      <div className="mt-6 grid md:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          {/* 요구사항 */}
          <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6">
            <h2 className="font-bold mb-3">
              요구사항 체크리스트{' '}
              <span className="text-sm font-normal text-slate-500">(멤버용)</span>
            </h2>
            <ul className="space-y-2 text-sm">
              {[
                { text: 'Context API로 구현된 기존 코드를 Zustand로 마이그레이션', checked: true },
                { text: 'store를 도메인 단위로 분리', checked: true },
                { text: 'selector로 불필요한 리렌더 방지', checked: false },
                { text: '비동기 데이터는 Tanstack Query로 분리', checked: false },
                { text: 'README에 "왜 Zustand인가" 작성', checked: false },
              ].map((item) => (
                <li key={item.text} className="flex gap-2">
                  <input type="checkbox" defaultChecked={item.checked} className="mt-1" />
                  {item.text}
                </li>
              ))}
            </ul>
          </section>

          {/* 제출 */}
          <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6">
            <h2 className="font-bold mb-3">내 제출</h2>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900 p-4">
              <div>
                <div className="font-medium">PR #128 — [adv-2.1] 박지호 미션 제출합니다</div>
                <div className="text-sm text-slate-500 mt-0.5">리뷰어 정우진 · 2라운드 · 마감 D-1</div>
              </div>
              <a
                href="#"
                className="px-3 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 whitespace-nowrap"
              >
                PR 열기 ↗
              </a>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {reflected ? (
                <span className="text-sm text-emerald-600 dark:text-emerald-400">
                  ✓ 리뷰어(정우진)에게 반영 완료를 알렸어요 · 재리뷰 대기 중
                </span>
              ) : (
                <button
                  onClick={() => setReflected(true)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-brand-soft"
                >
                  리뷰 반영 완료
                </button>
              )}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              리뷰 코멘트를 반영한 뒤 누르면 리뷰어에게 재리뷰 요청 알림이 갑니다. 실제 대화는
              GitHub PR에서.
            </p>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6">
            <h2 className="font-bold mb-3">진행 상태</h2>
            <ol className="relative border-s-2 border-slate-200 dark:border-white/10 ml-1 space-y-4 text-sm">
              {[
                { label: '제출됨', done: true },
                { label: '리뷰어 배정 (정우진)', done: true },
                { label: '리뷰 중 · 2R', active: true },
                { label: '기간 종료 → 머지(완료)', done: false },
              ].map((s) => (
                <li key={s.label} className={`ms-4 ${!s.done && !s.active ? 'opacity-50' : ''}`}>
                  <span
                    className={`absolute -start-[7px] w-3 h-3 rounded-full ${
                      s.done
                        ? 'bg-emerald-500'
                        : s.active
                          ? 'bg-brand animate-pulse'
                          : 'bg-slate-300'
                    }`}
                  />
                  {s.active ? <b className="text-brand">{s.label}</b> : s.label}
                </li>
              ))}
            </ol>
          </section>
          <Link
            href="/review"
            className="block rounded-2xl bg-brand/5 ring-1 ring-brand/20 p-5 hover:bg-brand/10"
          >
            <div className="text-sm font-semibold text-brand">리뷰어이신가요?</div>
            <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">리뷰 가이드라인 보기 →</div>
          </Link>
        </aside>
      </div>
    </main>
  );
}
