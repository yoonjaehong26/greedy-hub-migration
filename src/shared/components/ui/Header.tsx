'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRoleStore, ROLES, NAV_ITEMS } from '@/shared/core/stores/roleStore';
import { useThemeStore } from '@/shared/core/stores/themeStore';

export function Header() {
  const pathname = usePathname();
  const role = useRoleStore((s) => s.role);
  const toggle = useThemeStore((s) => s.toggle);
  const p = ROLES[role];

  const tabs = NAV_ITEMS.filter((n) => n.roles.includes(role));

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-900/5 dark:border-white/10">
      <nav className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="그리디" className="w-8 h-8 rounded-full object-cover" />
          <span>
            그리디 <span className="text-brand">허브</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`hover:text-brand transition-colors ${isActive(tab.href) ? 'text-brand font-semibold' : ''}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10"
            title="다크모드"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 15.75A9 9 0 1 1 8.25 2.25 7 7 0 0 0 21.75 15.75Z"
              />
            </svg>
          </button>

          {role === 'guest' ? (
            <a
              href="#"
              className="hidden sm:inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ring-1 ring-slate-900/10 dark:ring-white/15 hover:bg-slate-200/60 dark:hover:bg-white/10"
            >
              로그인
            </a>
          ) : (
            <Link
              href="/members/me"
              className="hidden sm:grid place-items-center w-9 h-9 rounded-full bg-slate-300 dark:bg-white/20 text-sm font-medium"
              title={`${p.name} · ${p.desc}`}
            >
              {p.name[0]}
            </Link>
          )}

          <Link
            href="/recruit"
            className="inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-brand-soft"
          >
            지원하기
          </Link>
        </div>
      </nav>
    </header>
  );
}
