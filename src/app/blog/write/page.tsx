import Link from 'next/link';

export const metadata = { title: '글쓰기 — 그리디 허브' };

export default function BlogWritePage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <div className="flex items-center justify-between gap-3">
        <Link href="/blog" className="text-sm text-slate-500 hover:text-brand">
          ← 블로그
        </Link>
        <div className="flex gap-2 text-sm">
          <button className="px-3 py-2 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/15 font-semibold">
            임시저장
          </button>
          <Link
            href="/blog/1"
            className="px-3 py-2 rounded-lg bg-brand text-white font-semibold"
          >
            발행
          </Link>
        </div>
      </div>

      <form className="mt-6 space-y-4">
        <input
          className="w-full text-2xl font-bold bg-transparent outline-none placeholder:text-slate-400"
          placeholder="제목을 입력하세요"
        />
        <div className="flex flex-wrap gap-2 text-sm">
          <select className="rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none">
            <option>회고</option>
            <option>기술</option>
            <option>취업</option>
            <option>트러블슈팅</option>
          </select>
          <input
            className="rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none"
            placeholder="태그 (예: React)"
          />
        </div>
        <div className="rounded-xl bg-white dark:bg-slate-800/70 ring-1 ring-slate-900/5 dark:ring-white/10 p-4">
          <div className="flex gap-3 text-slate-400 text-sm border-b border-slate-100 dark:border-white/10 pb-2 mb-3">
            <span title="굵게" className="cursor-pointer hover:text-slate-600">B</span>
            <span title="기울임" className="italic cursor-pointer hover:text-slate-600">i</span>
            <span title="코드블록" className="cursor-pointer hover:text-slate-600">{'</>'}</span>
            <span title="이미지 업로드" className="cursor-pointer hover:text-slate-600">🖼️ 이미지</span>
          </div>
          <textarea
            rows={14}
            className="w-full bg-transparent outline-none resize-none placeholder:text-slate-400"
            placeholder="마크다운으로 작성하세요. 이미지는 드래그하면 자동 업로드됩니다."
          />
        </div>
        <p className="text-xs text-slate-400">
          발행하면 공개(SEO) 기술블로그에 올라가고, 작성자 프로필·이력서에 자동으로 연결됩니다.
        </p>
      </form>
    </main>
  );
}
