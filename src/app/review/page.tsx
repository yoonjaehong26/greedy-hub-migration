'use client';

import Link from 'next/link';
import { useState } from 'react';

const PR_LIST = [
  { name: '박지호', status: '재리뷰 요청', statusCls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300', urgent: '마감 D-1', meta: '[adv-2.1] 상태관리 심화 · 2R · 반영 완료' },
  { name: '김민준', status: '리뷰중', statusCls: 'bg-brand/10 text-brand', urgent: null, meta: '[adv-2.1] 상태관리 심화 · 1R' },
  { name: '최예린', status: '신규', statusCls: 'bg-slate-200 dark:bg-white/10 text-slate-600', urgent: null, meta: '[adv-2.1] 상태관리 심화 · 0R' },
];

export default function ReviewPage() {
  const [selected, setSelected] = useState(0);
  const [reviewDone, setReviewDone] = useState(false);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">리뷰어 워크스페이스</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand/10 text-brand">리뷰어 화면</span>
      </div>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        정우진 · FE 리뷰어 — 내게 배정된 PR과 <b>미션별 리뷰 가이드라인</b>을 한 화면에서.
      </p>

      <div className="mt-8 grid lg:grid-cols-[320px_1fr] gap-6">
        {/* PR 리스트 */}
        <aside className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 divide-y divide-slate-100 dark:divide-white/10 h-max">
          <div className="p-4 text-sm font-semibold text-slate-500">내게 배정된 PR · {PR_LIST.length}</div>
          {PR_LIST.map((pr, i) => (
            <button
              key={pr.name}
              onClick={() => { setSelected(i); setReviewDone(false); }}
              className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-white/5 ${i === selected ? 'bg-brand/5 border-l-2 border-brand' : ''}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{pr.name}</span>
                <span className="flex gap-1 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${pr.statusCls}`}>{pr.status}</span>
                  {pr.urgent && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{pr.urgent}</span>}
                </span>
              </div>
              <div className="text-sm text-slate-500 mt-0.5">{pr.meta}</div>
            </button>
          ))}
        </aside>

        {/* 선택 상세 */}
        <section className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm text-slate-500">FE · 6주차 · {PR_LIST[selected].name}</div>
                <h2 className="text-xl font-bold mt-0.5">[adv-2.1] 상태관리 심화 — Zustand</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {reviewDone ? (
                  <span className="px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">
                    ✓ {PR_LIST[selected].name}에게 리뷰 완료를 알렸어요
                  </span>
                ) : (
                  <button
                    onClick={() => setReviewDone(true)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-brand-soft"
                  >
                    리뷰 완료
                  </button>
                )}
                <Link
                  href="/missions/1"
                  className="px-3 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                >
                  PR #128 →
                </Link>
                <button className="px-3 py-2 rounded-lg text-sm font-semibold ring-1 ring-slate-900/10 dark:ring-white/15">
                  리뷰 기간 연장
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
              <span>상태 <b className="text-brand">리뷰 중</b></span>
              <span>라운드 <b>2</b></span>
              <span>마감 <b className="text-amber-600">내일 23:59</b></span>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              ※ 실제 리뷰 대화는 GitHub PR에서. 웹은 상태·기한·가이드만 추적.
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-brand">📌</span>
              <h3 className="font-bold">
                리뷰 가이드라인{' '}
                <span className="text-sm font-normal text-slate-500">· 리드(강민서) 작성 · 열람 전용</span>
              </h3>
            </div>
            <div className="text-slate-700 dark:text-slate-300 space-y-3 text-sm leading-relaxed">
              <p>
                이번 미션은 <b>전역 상태 도구 선택의 근거</b>를 보는 게 핵심입니다.
              </p>
              <div>
                <div className="font-semibold mb-1">리뷰 체크포인트</div>
                <ul className="space-y-1">
                  {[
                    'store 분리 기준이 합리적인가 (도메인별 vs 화면별)',
                    '불필요한 리렌더 방지(selector) 적용 여부',
                    'Context 대비 트레이드오프를 설명할 수 있는가',
                    '비동기 상태는 Tanstack Query로 분리했는가',
                  ].map((c) => (
                    <li key={c} className="flex gap-2">
                      <input type="checkbox" className="mt-1" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-slate-500">
                톤: 정답 강요보다 <b>&quot;왜?&quot;를 묻는 티키타카</b>로. 좋은 포인트는 칭찬도 남겨주세요.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
