import Link from 'next/link';

export const metadata = { title: '미션 — 그리디 허브' };

const CARD_CLS = 'rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-5';

const MISSIONS = [
  {
    status: '마감 D-1',
    statusCls: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
    title: '[adv-2.1] 상태관리 심화 — Zustand',
    sub: '6주차 · 리뷰어 정우진',
    badge: '리뷰 중 · 2R',
    badgeCls: 'bg-brand/10 text-brand',
    pr: 'PR #128 →',
  },
  {
    status: '완료',
    statusCls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300',
    title: '[adv-1] 라우팅 기반 SPA',
    sub: '5주차 · 리뷰어 강민서',
    badge: '머지됨',
    badgeCls: 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300',
    pr: 'PR #119 →',
  },
  {
    status: '완료',
    statusCls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300',
    title: 'React Pokemon SSR',
    sub: '4주차 · 리뷰어 정우진',
    badge: '머지됨',
    badgeCls: 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300',
    pr: 'PR #101 →',
  },
];

export default function MissionsPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">내 미션</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
          멤버 화면
        </span>
      </div>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        박지호 · FE 4기 · 제출·리뷰 현황이 자동으로 기록됩니다.
      </p>

      <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={CARD_CLS} title="리뷰가 진행 중인 미션 수">
          <div className="text-sm text-slate-500">리뷰 중</div>
          <div className="mt-1 text-3xl font-bold text-brand">1</div>
        </div>
        <div className={CARD_CLS} title="리뷰 기간 종료 후 머지된 미션 수">
          <div className="text-sm text-slate-500">완료</div>
          <div className="mt-1 text-3xl font-bold text-emerald-600">5</div>
        </div>
        <div className={CARD_CLS} title="리뷰 마감이 임박한 미션">
          <div className="text-sm text-slate-500">마감 임박</div>
          <div className="mt-1 text-3xl font-bold text-amber-500">1</div>
        </div>
        <div className={CARD_CLS} title="쉬는 주를 제외한 미션 중 완료 비율">
          <div className="text-sm text-slate-500">완주율</div>
          <div className="mt-1 text-3xl font-bold">83%</div>
        </div>
      </div>

      <h2 className="mt-9 mb-3 text-lg font-semibold">
        미션 목록{' '}
        <span className="text-sm font-normal text-slate-500">· 클릭하면 상세로 이동</span>
      </h2>
      <div className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 divide-y divide-slate-100 dark:divide-white/10">
        {MISSIONS.map((m) => (
          <Link
            key={m.title}
            href="/missions/1"
            title="미션 상세 — 요구사항·내 PR·진행 상태 보기"
            className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/5"
          >
            <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${m.statusCls}`}>
              {m.status}
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-semibold truncate">{m.title}</div>
              <div className="text-sm text-slate-500">{m.sub}</div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${m.badgeCls}`}>
              {m.badge}
            </span>
            <span className="hidden sm:inline text-sm text-slate-400">{m.pr}</span>
          </Link>
        ))}
        <div
          className="flex items-center gap-4 p-4 opacity-70"
          title="시험·공휴일 주간은 미션을 진행하지 않습니다 (SKIPPED)"
        >
          <span className="text-xs px-2 py-1 rounded-full bg-slate-200 dark:bg-white/10 font-medium whitespace-nowrap text-slate-600 dark:text-slate-300">
            쉬는 주
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-semibold truncate">중간고사 주간 — 미션 없음</div>
            <div className="text-sm text-slate-500">7주차 · SKIPPED</div>
          </div>
        </div>
      </div>

      <Link
        href="/admin"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand"
        title="운영진 화면: 멤버×미션 전체 매트릭스"
      >
        운영진이신가요? 기수 전체 매트릭스 보기 →
      </Link>
    </main>
  );
}
