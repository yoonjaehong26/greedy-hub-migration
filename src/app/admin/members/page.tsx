'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Person { n: string; t: string; roles: string[] }

const ROLE_OPTS = ['멤버', '리뷰어', '리드', '메인테이너'];

const INITIAL_PEOPLE: Person[] = [
  { n: '박지호', t: 'FE', roles: ['멤버'] },
  { n: '김민준', t: 'FE', roles: ['멤버'] },
  { n: '정우진', t: 'FE', roles: ['리뷰어'] },
  { n: '강민서', t: 'FE', roles: ['리드', '리뷰어', '메인테이너'] },
  { n: '윤하준', t: 'FE', roles: ['리뷰어'] },
];

const PERMS = [
  { k: 'mission:create', label: '미션 출제·요구사항', on: false },
  { k: 'mission:review', label: '배정 미션 리뷰', on: true },
  { k: 'mission:assign', label: '리뷰어 배정', on: false },
  { k: 'study:manage', label: '커리큘럼·자료 관리', on: false },
  { k: 'board:moderate', label: '게시판 모더레이션', on: false },
  { k: 'recruit:review', label: '지원 심사', on: false },
  { k: 'admin:roles', label: '역할·권한 관리', on: false },
];

function chip(r: string, on: boolean) {
  return (
    <span
      key={r}
      className={`text-xs px-2 py-0.5 rounded-full ${on ? 'bg-brand/10 text-brand' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}
    >
      {r}
    </span>
  );
}

export default function AdminMembersPage() {
  const [people, setPeople] = useState<Person[]>(INITIAL_PEOPLE);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Person | null>(INITIAL_PEOPLE[2]);
  const [newName, setNewName] = useState('');
  const [newTrack, setNewTrack] = useState('FE');

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <Link href="/admin" className="text-sm text-slate-500 hover:text-brand">
        ← 운영진
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <h1 className="text-2xl font-bold">멤버·권한 관리</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">운영진 화면</span>
      </div>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        역할은 기수별로 다중 부여 가능(겸직). 세부 권한은 역할 기본값에 더해 개별 부여합니다.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        <input className="rounded-lg px-3 py-2 bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none" placeholder="멤버 검색…" />
        <select className="rounded-lg px-3 py-2 bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none">
          <option>4기</option>
          <option>3기</option>
        </select>
        <select className="rounded-lg px-3 py-2 bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none">
          <option>전체 트랙</option>
          <option>FE</option>
          <option>BE</option>
        </select>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="ml-auto px-3.5 py-2 rounded-lg bg-brand text-white font-semibold"
        >
          + 멤버 추가
        </button>
      </div>

      {showAdd && (
        <div className="mt-4 rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-5">
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block font-medium mb-1.5">이름</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none" placeholder="이름" />
            </div>
            <div>
              <label className="block font-medium mb-1.5">트랙</label>
              <select value={newTrack} onChange={(e) => setNewTrack(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none">
                <option>FE</option>
                <option>BE</option>
                <option>COMMON</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2 text-sm">
            <button
              onClick={() => {
                if (!newName.trim()) return;
                setPeople([{ n: newName.trim(), t: newTrack, roles: ['멤버'] }, ...people]);
                setNewName('');
                setShowAdd(false);
              }}
              className="px-3.5 py-2 rounded-lg bg-brand text-white font-semibold"
            >
              추가
            </button>
            <button onClick={() => setShowAdd(false)} className="px-3.5 py-2 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/15 font-semibold">
              취소
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
        <table className="w-full text-sm">
          <thead className="text-slate-500">
            <tr className="border-b border-slate-100 dark:border-white/10">
              <th className="text-left font-medium p-3">멤버</th>
              <th className="text-left font-medium p-3">트랙</th>
              <th className="text-left font-medium p-3">기수 역할 (다중)</th>
              <th className="text-right font-medium p-3">관리</th>
            </tr>
          </thead>
          <tbody>
            {people.map((p) => (
              <tr key={p.n} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="p-3 font-medium">
                  <Link href={`/members/${p.n}`} className="hover:text-brand">{p.n}</Link>
                </td>
                <td className="p-3">{p.t}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {ROLE_OPTS.map((r) => chip(r, p.roles.includes(r)))}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => setEditTarget(p)} className="text-brand font-semibold">편집</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 세부 권한 편집 */}
      <section className="mt-6 rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">
            세부 권한 편집 —{' '}
            {editTarget ? (
              <span>
                {editTarget.n}{' '}
                <span className="text-sm font-normal text-slate-500">
                  ({editTarget.t} 4기 · {editTarget.roles.join('·')})
                </span>
              </span>
            ) : '선택 없음'}
          </h2>
          <button className="text-sm font-semibold text-brand">저장</button>
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
          {PERMS.map((p) => (
            <label key={p.k} className="flex items-center justify-between rounded-lg ring-1 ring-slate-900/5 dark:ring-white/10 px-3 py-2 cursor-pointer">
              <span>
                <span className="font-medium">{p.label}</span>{' '}
                <code className="text-xs text-slate-400">{p.k}</code>
              </span>
              <input type="checkbox" defaultChecked={p.on} />
            </label>
          ))}
        </div>
      </section>
    </main>
  );
}
