export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:bg-slate-900 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-5 py-12 flex flex-col gap-3.5">
        <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="그리디" className="w-6 h-6 rounded-full object-cover" />
          그리디
        </div>
        <p className="text-[13px] text-neutral-500 dark:text-slate-400">
          세종대학교 개발 동아리 그리디예요. 스터디와 프로젝트로 함께 성장해요.
        </p>
        <div className="flex items-center gap-5 text-[13px] font-semibold text-neutral-700 dark:text-slate-300">
          <a href="#" className="hover:text-brand">
            GitHub
          </a>
          <a href="#" className="hover:text-brand">
            Instagram
          </a>
          <a href="#" className="hover:text-brand">
            문의하기
          </a>
        </div>
        <p className="text-xs text-neutral-500 dark:text-slate-400">© 2026 Greedy</p>
      </div>
    </footer>
  );
}
