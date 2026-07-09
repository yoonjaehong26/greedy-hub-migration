import Link from 'next/link';

export const metadata = { title: '미션 출제 — 그리디 허브' };

export default function MissionCreatePage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <div className="flex items-center justify-between gap-3">
        <Link href="/admin" className="text-sm text-slate-500 hover:text-brand">
          ← 운영진
        </Link>
        <div className="flex gap-2 text-sm">
          <button className="px-3 py-2 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/15 font-semibold">
            임시저장
          </button>
          <Link href="/missions" className="px-3 py-2 rounded-lg bg-brand text-white font-semibold">
            출제하기
          </Link>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <h1 className="text-2xl font-bold">미션 출제</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">운영진 화면</span>
      </div>

      <form className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">제목</label>
          <input
            className="w-full rounded-lg px-3 py-2 bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none"
            placeholder="예: [adv-2.1] 상태관리 심화 — Zustand"
          />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">트랙</label>
            <select className="w-full rounded-lg px-3 py-2 bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none">
              <option>FE</option>
              <option>BE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">주차/단계</label>
            <input
              className="w-full rounded-lg px-3 py-2 bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none"
              placeholder="6주차 / adv-2.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">기본 리뷰 기간(일)</label>
            <input
              type="number"
              defaultValue={7}
              className="w-full rounded-lg px-3 py-2 bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">연결 GitHub 레포</label>
          <input
            className="w-full rounded-lg px-3 py-2 bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none"
            placeholder="greedy-team/self-paced-react-advanced"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">설명</label>
          <textarea
            rows={3}
            className="w-full rounded-lg px-3 py-2 bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none resize-none"
            placeholder="미션 개요"
          />
        </div>

        {/* 요구사항 (멤버용) */}
        <div className="rounded-xl bg-white dark:bg-slate-800/70 ring-1 ring-slate-900/5 dark:ring-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold">
              요구사항 체크리스트{' '}
              <span className="font-normal text-slate-500">(멤버가 봄)</span>
            </label>
            <button className="text-xs font-semibold text-brand">+ 항목</button>
          </div>
          <div className="space-y-2 text-sm">
            {['Context → Zustand 마이그레이션', 'store를 도메인 단위로 분리'].map((item) => (
              <div key={item} className="flex gap-2 items-center">
                <span className="text-slate-400">•</span>
                <input defaultValue={item} className="flex-1 bg-transparent outline-none" />
              </div>
            ))}
            <div className="flex gap-2 items-center">
              <span className="text-slate-400">•</span>
              <input className="flex-1 bg-transparent outline-none" placeholder="새 요구사항…" />
            </div>
          </div>
        </div>

        {/* 리뷰 가이드라인 (리뷰어용) */}
        <div className="rounded-xl bg-brand/5 ring-1 ring-brand/20 p-4">
          <label className="text-sm font-semibold flex items-center gap-1.5">
            📌 리뷰 가이드라인{' '}
            <span className="font-normal text-slate-500">(리뷰어가 봄 · 미션에 영구 저장)</span>
          </label>
          <textarea
            rows={4}
            className="mt-2 w-full rounded-lg px-3 py-2 bg-white dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-white/10 text-sm outline-none resize-none"
            placeholder="이 미션은 이런 포인트로 리뷰해주세요 (마크다운)."
          />
        </div>
      </form>
    </main>
  );
}
