import Link from 'next/link';

export const metadata = { title: '스터디 — 그리디 허브' };

const WEEKS = [
  { week: '1주차', title: 'JSX & 컴포넌트 기초', status: 'done' as const },
  { week: '5주차', title: '라우팅 & SPA', status: 'active' as const },
  { week: '7주차', title: '중간고사 주간', status: 'break' as const },
];

const STATUS = {
  done: { label: '완료', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300' },
  active: { label: '진행 중', cls: 'bg-brand/10 text-brand' },
  break: { label: '쉬는 주', cls: 'bg-slate-200 dark:bg-white/10 text-slate-500' },
};

export default function StudyPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold">스터디</h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">멤버 화면</span>
          </div>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            트랙별 커리큘럼과 자료 — 노션에 흩어지지 않게 한곳에.
          </p>
        </div>
        <div className="inline-flex rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 overflow-hidden text-sm">
          <button className="px-4 py-2 bg-brand text-white">FE</button>
          <button className="px-4 py-2 bg-white dark:bg-slate-800">BE</button>
        </div>
      </div>

      <ol className="mt-8 space-y-3">
        {WEEKS.map((w) => {
          const s = STATUS[w.status];
          return (
            <li
              key={w.week}
              className={`rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-5 ${w.status === 'break' ? 'opacity-70' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-brand">{w.week}</span>
                  <h3 className="font-semibold">{w.title}</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${s.cls}`}>{s.label}</span>
              </div>
              {w.status !== 'break' && (
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <a
                    href="#"
                    className="px-3 py-1.5 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    📄 스터디 노트
                  </a>
                  <a
                    href="#"
                    className="px-3 py-1.5 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    🔗 노션 자료
                  </a>
                  <Link
                    href="/missions/1"
                    className="px-3 py-1.5 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    🎯 연결 미션
                  </Link>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </main>
  );
}
