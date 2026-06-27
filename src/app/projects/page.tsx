import Link from 'next/link';

export const metadata = { title: '팀 프로젝트 — 그리디 허브' };

const GRADS = ['from-brand/30', 'from-emerald-400/30', 'from-amber-400/30', 'from-rose-400/30', 'from-violet-400/30', 'from-cyan-400/30'];

const PROJECTS = [
  { name: '모꼬지', meta: '4기 · 공통', desc: '세종대 동아리 통합 플랫폼', team: '5명' },
  { name: '두구두구', meta: '3기 · FE/BE', desc: '행사용 실시간 추첨 도구', team: '4명' },
  { name: '리더보드', meta: '축제 · 부스', desc: '세종대 축제 부스 게임 웹', team: '3명' },
  { name: '세종라이프', meta: '3기 · 공통', desc: '세종대 생활 정보 서비스', team: '5명' },
  { name: '그리니 목늘이기', meta: '축제 · 게임', desc: '웹 미니게임 (축제 부스)', team: '2명' },
  { name: '밋링크', meta: '2기 · FE/BE', desc: '모임 일정 조율 서비스', team: '4명' },
];

const FILTERS = ['전체', '4기', '3기', 'FE', 'BE'];

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">팀 프로젝트 아카이브</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300">공개 화면</span>
      </div>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        스터디 이후 팀을 꾸려 만든 결과물 · 데모데이 발표작.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            className={`px-3 py-1.5 rounded-full ${i === 0 ? 'bg-brand text-white' : 'bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-5">
        {PROJECTS.map((p, i) => (
          <Link
            key={p.name}
            href={`/projects/${i + 1}`}
            className="block rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden hover:-translate-y-0.5 transition"
          >
            <div className={`h-32 bg-gradient-to-br ${GRADS[i % GRADS.length]} to-slate-300 dark:to-slate-700`} />
            <div className="p-5">
              <div className="text-xs text-slate-500">{p.meta}</div>
              <h3 className="mt-1 font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{p.desc}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>👥 {p.team}</span>
                <span className="text-brand font-medium">상세 →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
