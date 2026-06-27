import Link from 'next/link';

export const metadata = { title: '4기 MT — 그리디 허브' };

const GRADS = ['from-brand/30', 'from-emerald-400/30', 'from-amber-400/30', 'from-rose-400/30', 'from-violet-400/30', 'from-cyan-400/30'];

export default function ActivityDetailPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex items-center justify-between gap-3">
        <Link href="/gallery" className="text-sm text-slate-500 hover:text-brand">
          ← 활동 타임라인
        </Link>
        <Link
          href="/gallery/1/edit"
          className="px-3 py-2 rounded-lg text-sm font-semibold ring-1 ring-slate-900/10 dark:ring-white/15"
        >
          편집
        </Link>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <time className="text-sm font-semibold text-slate-500">2026.05</time>
        <span className="text-xs px-2 py-0.5 rounded-full bg-brand/10 text-brand">행사</span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">4기 MT — 1박 2일</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300">공개 화면</span>
      </div>

      <div className="mt-5 aspect-[16/7] rounded-2xl bg-gradient-to-br from-brand/40 to-slate-300 dark:to-slate-700" />

      <article className="mt-6 space-y-3 leading-relaxed text-slate-700 dark:text-slate-300">
        <p>4기가 처음으로 다 같이 모인 엠티였습니다. 낮엔 팀 게임, 밤엔 각자 관심 분야 코드 이야기로 새벽까지.</p>
        <p>처음 만난 멤버들도 금방 친해졌고, 다음 스터디·프로젝트로 이어질 팀워크의 시작이 됐어요.</p>
      </article>

      <h2 className="mt-8 mb-3 font-bold">함께한 멤버</h2>
      <div className="flex flex-wrap gap-2">
        {['박지호', '최예린', '김민준', '이서연'].map((n) => (
          <Link
            key={n}
            href={`/members/${n}`}
            className="inline-flex items-center gap-1 text-sm px-2.5 py-1 rounded-full bg-brand/10 text-brand hover:bg-brand/20"
          >
            @{n}
          </Link>
        ))}
        <span className="inline-flex items-center text-sm px-2.5 py-1 rounded-full bg-slate-200 dark:bg-white/10 text-slate-500">+8</span>
      </div>

      <h2 className="mt-8 mb-3 font-bold">사진</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {GRADS.map((g, i) => (
          <div
            key={i}
            className={`aspect-[4/3] rounded-xl bg-gradient-to-br ${g} to-slate-200 dark:to-slate-700`}
          />
        ))}
      </div>

      <p className="mt-6 text-xs text-slate-400">
        사진·내용 추가는 멤버도 가능합니다. 편집·정리(대표 사진 지정·삭제)는 운영진이 합니다.
      </p>
    </main>
  );
}
