'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRoleStore, ROLES, NAV_ITEMS } from '@/shared/core/stores/roleStore';
import { useThemeStore } from '@/shared/core/stores/themeStore';
import { Button } from './Button';

export function Header() {
  const pathname = usePathname();
  const role = useRoleStore((s) => s.role);
  const toggle = useThemeStore((s) => s.toggle);
  const p = ROLES[role];
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = NAV_ITEMS.filter((n) => n.roles.includes(role));

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/90 dark:bg-slate-900/80 border-b border-neutral-200 dark:border-white/10">
      <nav className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-neutral-900 dark:text-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="그리디" className="w-8 h-8 rounded-full object-cover" />
          <span>
            그리디 <span className="text-brand">허브</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <span className={isActive(tab.href) ? 'font-semibold text-neutral-900 dark:text-slate-100' : ''}>
                {tab.label}
              </span>
              <span
                className={`h-[2px] w-full rounded-full ${isActive(tab.href) ? 'bg-brand' : 'bg-transparent'}`}
              />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-600 dark:text-slate-300"
            title="다크모드"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
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
              className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ring-1 ring-neutral-200 hover:bg-neutral-100 dark:ring-white/15 dark:hover:bg-white/10"
            >
              로그인
            </a>
          ) : (
            <Link
              href="/members/me"
              className="grid place-items-center w-9 h-9 rounded-full bg-neutral-200 dark:bg-white/20 text-sm font-medium"
              title={`${p.name} · ${p.desc}`}
            >
              {p.name[0]}
            </Link>
          )}

          <Button href="/recruit" size="sm">
            지원하기
          </Button>
        </div>

        <button
          type="button"
          aria-label="메뉴 열기"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 -mr-2 text-neutral-700 dark:text-slate-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white dark:bg-slate-900 dark:border-white/10">
          <div className="flex flex-col px-5 py-4 gap-1">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setMenuOpen(false)}
                className={`py-2.5 text-[15px] ${
                  isActive(tab.href)
                    ? 'font-semibold text-neutral-900 dark:text-slate-100'
                    : 'text-neutral-600 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </Link>
            ))}
            <Button href="/recruit" size="sm" className="mt-2 w-full">
              지원하기
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
