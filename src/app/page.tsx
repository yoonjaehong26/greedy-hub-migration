import Link from 'next/link';

const STATS = [
  { label: '누적 멤버', value: '~50' },
  { label: '진행 기수', value: '4기' },
  { label: '트랙', value: 'FE · BE' },
  { label: '팀 프로젝트', value: '12+' },
];

const FEATURES = [
  { icon: '📝', title: '매주 미션', desc: '트랙별 커리큘럼대로 매주 구현하고 PR로 제출합니다.', href: '/missions' },
  { icon: '💬', title: '리뷰 티키타카', desc: '리뷰어가 배정돼 함께 코드를 다듬습니다. 가이드는 한곳에.', href: '/review' },
  { icon: '🚀', title: '팀 프로젝트', desc: '팀을 꾸려 프로젝트를 만들고 데모데이에서 발표합니다.', href: '/projects' },
  { icon: '📈', title: '기록 = 이력', desc: '미션·리뷰·글이 자동으로 내 프로필에 쌓여 이력서가 됩니다.', href: '/members/me' },
];

const BLOG_POSTS = [
  { tags: ['회고', 'React'], title: '상태관리 미션, Zustand로 다시 짜며 배운 것', author: '박지호', meta: 'FE 4기 · 3일 전' },
  { tags: ['기술', 'Spring'], title: 'N+1 쿼리, 리뷰에서 잡힌 그날의 기록', author: '이서연', meta: 'BE 4기 · 1주 전' },
  { tags: ['취업'], title: '그리디 활동을 이력서로 정리한 방법', author: '최예린', meta: 'FE 2기 · 2주 전' },
];

const PROJECTS = [
  { gradient: 'from-brand/30 to-slate-300 dark:to-slate-700', gen: '4기 · 공통', name: '모꼬지 — 동아리 통합 플랫폼' },
  { gradient: 'from-emerald-400/30 to-slate-300 dark:to-slate-700', gen: '3기 · FE/BE', name: '두구두구 — 실시간 추첨' },
  { gradient: 'from-amber-400/30 to-slate-300 dark:to-slate-700', gen: '축제 · 부스', name: '리더보드 — 축제 부스 게임' },
];

export default function HomePage() {
  return (
    <main>
      {/* 히어로 */}
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-brand/10 text-brand mb-5">
              세종대학교 개발 동아리 · 4기 모집 예정
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
              함께 만들고,
              <br />
              기록으로 <span className="text-brand">성장</span>한다.
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              그리디는 세종대학교의 개발 스터디·프로젝트 동아리입니다. 매주 미션과 리뷰로 함께
              성장하고, 그 발자취가 <b>각자의 이력</b>으로 남습니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/recruit"
                className="px-5 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-soft"
              >
                4기 지원하기
              </Link>
              <a
                href="#about"
                className="px-5 py-3 rounded-xl font-semibold ring-1 ring-slate-900/10 dark:ring-white/15 hover:bg-white dark:hover:bg-white/10"
              >
                둘러보기
              </a>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="그리디 로고"
              className="w-64 h-64 rounded-full shadow-xl ring-1 ring-black/5"
            />
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-5"
            >
              <dt className="text-sm text-slate-500">{s.label}</dt>
              <dd className="mt-1 text-3xl font-bold">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 무엇을 하나 */}
      <section id="about" className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="text-2xl md:text-3xl font-bold leading-snug">그리디는 이렇게 굴러갑니다</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          모집 → OT → 스터디(미션·리뷰 티키타카) → 팀 프로젝트(데모데이) → 회고
        </p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6 hover:-translate-y-0.5 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand grid place-items-center mb-4 font-bold">
                {f.icon}
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 최신 블로그 */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold leading-snug">최신 기술블로그</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              멤버와 이전 기수가 남긴 기록 — 공개
            </p>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-brand hover:underline">
            전체 보기 →
          </Link>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {BLOG_POSTS.map((p) => (
            <Link
              key={p.title}
              href="/blog"
              className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6 hover:-translate-y-0.5 transition"
            >
              <div className="flex gap-2 mb-3">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="font-semibold leading-snug">{p.title}</h3>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span className="w-6 h-6 rounded-full bg-slate-300 dark:bg-white/20" />
                {p.author} · {p.meta}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 프로젝트 */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-bold leading-snug">기수별 팀 프로젝트</h2>
          <Link href="/projects" className="text-sm font-semibold text-brand hover:underline">
            아카이브 →
          </Link>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {PROJECTS.map((p) => (
            <Link
              key={p.name}
              href="/projects"
              className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden hover:-translate-y-0.5 transition"
            >
              <div className={`h-32 bg-gradient-to-br ${p.gradient}`} />
              <div className="p-5">
                <div className="text-xs text-slate-500">{p.gen}</div>
                <h3 className="mt-1 font-semibold">{p.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 모집 CTA */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br from-brand to-brand-soft text-white">
          <h2 className="text-2xl md:text-3xl font-bold leading-snug">개발, 같이 꾸준히 하고 싶다면</h2>
          <p className="mt-3 text-white/90">방학마다 새 기수를 모집합니다. 재학생·휴학생 누구나 환영.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/recruit"
              className="px-5 py-3 rounded-xl bg-white text-brand font-semibold hover:bg-slate-100"
            >
              지원서 작성
            </Link>
            <Link
              href="/recruit"
              className="px-5 py-3 rounded-xl ring-1 ring-white/40 font-semibold hover:bg-white/10"
            >
              모집 안내 보기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
