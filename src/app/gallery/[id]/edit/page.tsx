import Link from 'next/link';

export const metadata = { title: '활동 올리기 — 그리디 허브' };

export default function ActivityEditPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <div className="flex items-center justify-between gap-3">
        <Link href="/gallery" className="text-sm text-slate-500 hover:text-brand">
          ← 활동 타임라인
        </Link>
        <div className="flex gap-2 text-sm">
          <Link
            href="/gallery"
            className="px-3 py-2 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/15 font-semibold"
          >
            취소
          </Link>
          <Link href="/gallery" className="px-3 py-2 rounded-lg bg-brand text-white font-semibold">
            올리기
          </Link>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <h1 className="text-2xl font-bold">활동 올리기</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">멤버 화면</span>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        멤버 누구나 활동·사진을 올릴 수 있어요. 정리·삭제는 운영진이 합니다.
      </p>

      <form className="mt-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">날짜</label>
            <input
              type="month"
              defaultValue="2026-05"
              className="w-full rounded-lg px-3 py-2 bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">분류</label>
            <select className="w-full rounded-lg px-3 py-2 bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none">
              <option>행사</option>
              <option>세션</option>
              <option>데모데이</option>
              <option>축제</option>
              <option>MT</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">제목</label>
          <input
            className="w-full rounded-lg px-3 py-2 bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none"
            placeholder="예: 4기 MT — 1박 2일"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">
            내용 <span className="font-normal text-slate-400">· 마크다운</span>
          </label>
          <div className="rounded-xl bg-white dark:bg-slate-800/70 ring-1 ring-slate-900/5 dark:ring-white/10 p-3">
            <div className="flex gap-3 text-slate-400 text-sm border-b border-slate-100 dark:border-white/10 pb-2 mb-2">
              <span title="굵게" className="cursor-pointer"><b>B</b></span>
              <span title="기울임" className="italic cursor-pointer">i</span>
              <span title="코드" className="cursor-pointer">{'</>'}</span>
              <span title="리스트" className="cursor-pointer">≣</span>
            </div>
            <textarea
              rows={6}
              className="w-full bg-transparent outline-none resize-none placeholder:text-slate-400"
              placeholder="활동을 한두 문단으로 적어주세요."
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">사진</label>
          <button
            type="button"
            className="w-full rounded-xl border-2 border-dashed border-slate-300 dark:border-white/15 p-6 text-center text-sm text-slate-500 hover:border-brand hover:text-brand"
          >
            📷 사진을 끌어다 놓거나 <b>클릭해서 추가</b>
            <br />
            <span className="text-xs">업로드하면 자동 저장됩니다</span>
          </button>
        </div>
      </form>
    </main>
  );
}
