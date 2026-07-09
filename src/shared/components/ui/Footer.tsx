export function Footer() {
  return (
    <footer className="border-t border-slate-900/5 dark:border-white/10 mt-16">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="그리디" className="w-7 h-7 rounded-full object-cover" />
          그리디 허브
        </div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-brand">
            GitHub
          </a>
          <a href="#" className="hover:text-brand">
            Discord
          </a>
        </div>
        <div>© 2026 GREEDY · 세종대학교</div>
      </div>
    </footer>
  );
}
