/**
 * layout.tsx — 루트 레이아웃 (서버 컴포넌트)
 *
 * 라우팅 진입점. 로직 없이 전역 프로바이더만 조립한다.
 * StyledComponentsRegistry(SSR 스타일) → AppQueryProvider(서버 상태) 순서로 트리를 감싼다.
 */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppQueryProvider } from '@/shared/components/providers/AppQueryProvider';
import { StyledComponentsRegistry } from '@/shared/components/providers/StyledComponentsRegistry';

export const metadata: Metadata = {
  title: '그리디 허브',
  description: '그리디의 연혁·멤버·스터디·미션·게시판·지원·추억을 한곳에서 추적하는 공식 허브',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <StyledComponentsRegistry>
          <AppQueryProvider>{children}</AppQueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
