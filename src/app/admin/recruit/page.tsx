'use client';

import Link from 'next/link';
import { useState } from 'react';

type Stage = '서류' | '면접' | '합격' | '불합격';

interface Applicant {
  name: string; track: string; no: string; email: string;
  discord: string; gh: string; stage: Stage; date: string; motive: string;
}

const STAGE_CLS: Record<Stage, string> = {
  서류: 'bg-brand/10 text-brand',
  면접: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
  합격: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300',
  불합격: 'bg-slate-200 text-slate-500 dark:bg-white/10',
};

const APPS: Applicant[] = [
  { name: '강서윤', track: 'FE', no: '컴퓨터공학과 21', email: 'seoyun@sju.ac.kr', discord: 'seoyun_k', gh: 'github.com/seoyun', stage: '서류', date: '2026.06.08', motive: '리액트를 독학했는데 혼자선 한계를 느껴요. 리뷰 받으며 제대로 된 코드를 쓰고 싶어 지원합니다.' },
  { name: '노지훈', track: 'BE', no: '소프트웨어학과 22', email: 'jihoon@sju.ac.kr', discord: 'jihoon99', gh: 'github.com/jihoon', stage: '서류', date: '2026.06.08', motive: '스프링으로 사이드 프로젝트를 했지만 설계가 약합니다. 미션·리뷰로 기본기를 다지고 싶어요.' },
  { name: '명수아', track: 'FE', no: '컴퓨터공학과 22', email: 'sua@sju.ac.kr', discord: 'sua.m', gh: '', stage: '서류', date: '2026.06.09', motive: '동아리 활동으로 꾸준함을 만들고, 팀 프로젝트까지 경험하고 싶습니다.' },
  { name: '한가람', track: 'FE', no: '컴퓨터공학과 23', email: 'garam@sju.ac.kr', discord: 'garam', gh: 'github.com/garam', stage: '면접', date: '2026.06.07', motive: 'JS 기초는 있고 React 입문 단계예요. 체계적인 커리큘럼이 매력적이라 지원했습니다.' },
  { name: '도윤재', track: 'BE', no: '인공지능학과 21', email: 'yunjae@sju.ac.kr', discord: 'yunjae_do', gh: 'github.com/yunjae', stage: '합격', date: '2026.06.06', motive: 'CS 기초와 Java 경험이 있고, 리뷰어로도 기여하고 싶습니다.' },
];

const STATS = [
  { label: '총 지원', value: 5 },
  { label: '서류 심사', value: 3, cls: 'text-brand' },
  { label: '면접', value: 1, cls: 'text-amber-500' },
  { label: '합격', value: 1, cls: 'text-emerald-600' },
];

export default function AdminRecruitPage() {
  const [selected, setSelected] = useState(0);
  const a = APPS[selected];

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <Link href="/admin" className="text-sm text-slate-500 hover:text-brand">
        ← 운영진
      </Link>
      <div className="mt-3 flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">지원자 관리</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">운영진 화면</span>
      </div>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        들어온 지원서를 한눈에. 결과는 지원자에게 <b>개별 연락</b>으로 안내합니다.
      </p>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-4">
            <div className="text-sm text-slate-500">{s.label}</div>
            <div className={`mt-1 text-2xl font-bold ${s.cls ?? ''}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-[320px_1fr] gap-6">
        {/* 지원자 목록 */}
        <aside className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 divide-y divide-slate-100 dark:divide-white/10 h-max">
          <div className="p-4 text-sm font-semibold text-slate-500">지원자 · {APPS.length}명</div>
          {APPS.map((ap, i) => (
            <button
              key={ap.name}
              onClick={() => setSelected(i)}
              className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-white/5 ${i === selected ? 'bg-brand/5 border-l-2 border-brand' : ''}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{ap.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${STAGE_CLS[ap.stage]}`}>{ap.stage}</span>
              </div>
              <div className="text-sm text-slate-500 mt-0.5">{ap.track} · {ap.no}</div>
            </button>
          ))}
        </aside>

        {/* 선택 상세 */}
        <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{a.name}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full ${STAGE_CLS[a.stage]}`}>{a.stage}</span>
              </div>
              <div className="text-sm text-slate-500 mt-0.5">{a.track} · {a.no} · 제출 {a.date}</div>
            </div>
            <div className="flex gap-2 text-sm">
              <a href={`mailto:${a.email}`} className="px-3 py-2 rounded-lg bg-brand text-white font-semibold">
                이메일로 연락
              </a>
              <select className="rounded-lg px-2 py-2 bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none">
                {(['서류', '면접', '합격', '불합격'] as Stage[]).map((s) => (
                  <option key={s} selected={s === a.stage}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {[
              ['이메일', a.email],
              ['디스코드', a.discord],
              ['GitHub', a.gh || '—'],
              ['트랙', a.track],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-slate-400">{k}</div>
                <div className="font-medium break-all">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <div className="text-sm font-semibold text-slate-500 mb-1">지원 동기</div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed rounded-xl bg-slate-50 dark:bg-slate-900 p-4">
              {a.motive}
            </p>
          </div>
          <div className="mt-5 flex gap-2 text-sm">
            <button className="px-3 py-2 rounded-lg bg-emerald-600 text-white font-semibold">
              합격 · 멤버 전환
            </button>
            <button className="px-3 py-2 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/15 font-semibold">
              불합격
            </button>
          </div>
        </section>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        지원자에겐 사이트 상태가 노출되지 않습니다. 통보는 이메일/디스코드로 직접.
      </p>
    </main>
  );
}
