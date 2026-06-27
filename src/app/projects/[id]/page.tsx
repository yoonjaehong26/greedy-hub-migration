import Link from 'next/link';

export const metadata = { title: '모꼬지 — 그리디 허브' };

const TEAM = [
  { name: '박지호', role: 'FE' },
  { name: '최예린', role: 'FE' },
  { name: '이서연', role: 'BE' },
];

const STACK = ['Next.js', 'Spring Boot', 'PostgreSQL'];

export default function ProjectDetailPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/projects" className="text-sm text-slate-500 hover:text-brand">
        ← 프로젝트
      </Link>

      <div className="mt-4 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
        <div className="h-40 bg-gradient-to-br from-brand/30 to-slate-300 dark:to-slate-700" />
        <div className="p-6">
          <div className="text-xs text-slate-500">4기 · 공통</div>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-2xl font-bold">모꼬지 — 동아리 통합 플랫폼</h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300">공개 화면</span>
          </div>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            세종대학교의 여러 동아리를 한곳에서 잇는 통합 플랫폼. 데모데이에서 발표된 4기 팀
            프로젝트.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <a
              href="#"
              className="px-3 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold"
            >
              GitHub ↗
            </a>
            <a href="#" className="px-3 py-2 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/15 font-semibold">
              라이브 데모 ↗
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6">
          <h2 className="font-bold mb-3">팀원</h2>
          <ul className="space-y-2 text-sm">
            {TEAM.map((t) => (
              <li key={t.name}>
                <Link href={`/members/${t.name}`} className="flex items-center gap-2 hover:text-brand">
                  <span className="w-7 h-7 rounded-full bg-slate-300 dark:bg-white/20" />
                  {t.name} · {t.role}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6">
          <h2 className="font-bold mb-3">기술 스택</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {STACK.map((s) => (
              <span key={s} className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-white/10">
                {s}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
