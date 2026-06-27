import Link from 'next/link';

export const metadata = { title: '운영진 대시보드 — 그리디 허브' };

type CellStatus = 'done' | 'review' | 'none';

const CELL_CLS: Record<CellStatus, string> = {
  done: 'bg-emerald-500',
  review: 'bg-brand',
  none: 'bg-slate-300 dark:bg-white/20',
};

const ROWS: [string, CellStatus[]][] = [
  ['김민준', ['done', 'done', 'done', 'review', 'done', 'none']],
  ['이서연', ['done', 'done', 'done', 'done', 'done', 'done']],
  ['박지호', ['done', 'done', 'done', 'done', 'done', 'review']],
  ['최예린', ['done', 'done', 'done', 'done', 'done', 'none']],
];

function rate(a: CellStatus[]) {
  return Math.round((a.filter((x) => x === 'done').length / a.length) * 100) + '%';
}

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">운영진 대시보드</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">운영진 화면</span>
      </div>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        4기 · FE 트랙 기준. 메인테이너·리드가 미션·리뷰·멤버를 한눈에 관리합니다.
      </p>

      <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: '기수 완주율', value: '88%', cls: '' },
          { label: '리뷰 진행', value: 3, cls: 'text-brand' },
          { label: '마감 임박', value: 1, cls: 'text-amber-500' },
          { label: '미제출', value: 1, cls: '' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-5">
            <div className="text-sm text-slate-500">{s.label}</div>
            <div className={`mt-1 text-3xl font-bold ${s.cls}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link href="/missions/create" className="px-3.5 py-2 rounded-lg bg-brand text-white font-semibold">
          + 미션 출제
        </Link>
        <Link href="/admin/members" className="px-3.5 py-2 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 font-semibold">
          멤버·권한 관리
        </Link>
        <Link href="/review" className="px-3.5 py-2 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 font-semibold">
          리뷰 배정 현황
        </Link>
        <Link href="/admin/recruit" className="px-3.5 py-2 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 font-semibold">
          지원자 관리
        </Link>
      </div>

      <div className="mt-9 flex items-center justify-between">
        <h2 className="text-lg font-semibold">멤버 × 미션 매트릭스</h2>
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 overflow-hidden text-sm">
            <button className="px-3 py-1.5 bg-brand text-white">FE</button>
            <button className="px-3 py-1.5 bg-white dark:bg-slate-800">BE</button>
          </div>
          <div className="hidden sm:flex gap-3 text-xs text-slate-500">
            {[
              { cls: 'bg-emerald-500', label: '완료' },
              { cls: 'bg-brand', label: '리뷰중' },
              { cls: 'bg-slate-300 dark:bg-white/20', label: '미제출' },
            ].map((l) => (
              <span key={l.label} className="inline-flex items-center gap-1">
                <i className={`w-3 h-3 rounded-sm ${l.cls} inline-block`} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
        <table className="w-full text-sm">
          <thead className="text-slate-500">
            <tr className="border-b border-slate-100 dark:border-white/10">
              <th className="text-left font-medium p-3 sticky left-0 bg-white dark:bg-slate-800">멤버</th>
              {[1, 2, 3, 4, 5, 6].map((n) => <th key={n} className="p-3 font-medium">{n}주</th>)}
              <th className="p-3 font-medium">완주율</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([name, cells]) => (
              <tr key={name} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="p-3 font-medium sticky left-0 bg-white dark:bg-slate-800">
                  <Link href={`/members/${name}`} className="hover:text-brand">{name}</Link>
                </td>
                {cells.map((s, i) => (
                  <td key={i} className="p-3 text-center">
                    <Link href="/missions/1" className={`inline-block w-6 h-6 rounded-md ${CELL_CLS[s]} hover:ring-2 hover:ring-offset-1 hover:ring-brand`} />
                  </td>
                ))}
                <td className="p-3 text-center font-semibold">{rate(cells)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        행(멤버) 클릭 → 멤버 프로필 · 셀 클릭 → 해당 제출 상세.
      </p>
    </main>
  );
}
