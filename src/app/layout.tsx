import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppQueryProvider } from '@/shared/components/providers/AppQueryProvider';
import { StyledComponentsRegistry } from '@/shared/components/providers/StyledComponentsRegistry';
import { ThemeProvider } from '@/shared/components/providers/ThemeProvider';

export const metadata: Metadata = {
  title: '그리디 허브',
  description: '그리디의 연혁·멤버·스터디·미션·게시판·지원·추억을 한곳에서 추적하는 공식 허브',
};

// FOUC 방지: React 하이드레이션 전에 localStorage 테마를 html[data-theme]에 주입
const themeInitScript = `(function(){try{var t=localStorage.getItem('greedy-hub-theme');var v=t?JSON.parse(t)?.state?.colorScheme:null;document.documentElement.setAttribute('data-theme',v==='dark'?'dark':'light');}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" data-theme="light">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
        {/* biome-ignore lint: FOUC 방지 인라인 스크립트 */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <StyledComponentsRegistry>
          <AppQueryProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AppQueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
