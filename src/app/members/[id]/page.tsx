import Link from 'next/link';

export const metadata = { title: '박지호 — 그리디 허브' };

export default function MemberProfilePage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <Link href="/members" className="text-sm text-slate-500 hover:text-brand">
        ← 멤버 디렉토리
      </Link>

      {/* 프로필 헤더 */}
      <div className="mt-3 rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-slate-300 dark:bg-white/20 grid place-items-center text-2xl font-bold">
            박
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">박지호</h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300">공개 화면</span>
            </div>
            <div className="text-slate-500 mt-0.5">@jiho-park · 세종대학교</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300 font-medium">
                FE 4기 · 멤버
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 text-sm">
            <button className="px-3 py-2 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/15 font-semibold">
              편집
            </button>
          </div>
        </div>
        <p className="mt-5 text-slate-600 dark:text-slate-300">
          프론트엔드에 관심 많은 개발자. 그리디에서 미션·리뷰로 성장 중. 이 페이지는 활동이 쌓이며{' '}
          <b>자동으로 갱신</b>됩니다.
        </p>
      </div>

      {/* 통계 */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { value: 5, label: '완료 미션', cls: 'text-brand' },
          { value: 1, label: '팀 프로젝트', cls: '' },
          { value: 3, label: '기술 글', cls: '' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-5 text-center"
          >
            <div className={`text-3xl font-bold ${s.cls}`}>{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* 완료 미션 */}
        <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6">
          <h2 className="font-bold mb-1">완료 미션</h2>
          <p className="text-xs text-slate-400 mb-4">성취(머지 완료)만 공개</p>
          <ul className="space-y-3 text-sm">
            {[
              { title: '[adv-1] 라우팅 기반 SPA', meta: 'FE 4기 · 5주차' },
              { title: 'React Pokemon SSR', meta: 'FE 4기 · 4주차' },
              { title: 'TodoList 최적화', meta: 'FE 4기 · 3주차' },
            ].map((m) => (
              <li key={m.title}>
                <Link
                  href="/missions/1"
                  className="flex items-center gap-3 hover:text-brand"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="flex-1">
                    <div className="font-medium">{m.title}</div>
                    <div className="text-slate-500">{m.meta}</div>
                  </div>
                  <span className="text-slate-400">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 블로그 */}
        <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6">
          <h2 className="font-bold mb-4">기술블로그</h2>
          <ul className="space-y-3 text-sm">
            {[
              { title: '상태관리 미션, Zustand로 다시 짜며 배운 것', meta: '회고 · 3일 전' },
              { title: '렌더링 최적화 삽질기', meta: '기술 · 3주 전' },
              { title: '첫 미션 PR, 리뷰 받고 느낀 것', meta: '회고 · 한 달 전' },
            ].map((b) => (
              <li key={b.title}>
                <Link href="/blog/1" className="font-medium hover:text-brand">
                  {b.title}
                </Link>
                <div className="text-slate-500">{b.meta}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* 활동 */}
        <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6 md:col-span-2">
          <h2 className="font-bold mb-1">참여한 활동</h2>
          <p className="text-xs text-slate-400 mb-4">활동에 멘션되면 자동으로 모입니다</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { date: '2026.05', type: '행사', title: '4기 MT — 1박 2일' },
              { date: '2026.04', type: '세션', title: 'React 심화 세션' },
              { date: '2026.03', type: '행사', title: '4기 OT' },
            ].map((a) => (
              <Link
                key={a.title}
                href="/gallery/1"
                className="rounded-xl ring-1 ring-slate-900/5 dark:ring-white/10 p-4 hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <div className="text-xs text-slate-500">
                  {a.date} · <span className="text-brand">{a.type}</span>
                </div>
                <div className="font-medium mt-0.5">{a.title}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* 팀 프로젝트 */}
        <section className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6 md:col-span-2">
          <h2 className="font-bold mb-4">팀 프로젝트</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/projects/1"
              className="flex gap-3 p-3 rounded-xl ring-1 ring-slate-900/5 dark:ring-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-brand/30 to-slate-300 dark:to-slate-700" />
              <div>
                <div className="font-medium">모꼬지</div>
                <div className="text-sm text-slate-500">4기 · FE 담당</div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
