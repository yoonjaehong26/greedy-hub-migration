/**
 * next.config.ts — Next.js 빌드/런타임 설정
 *
 * styled-components SWC 변환을 켜서 SSR 시 스타일 직렬화 + displayName을 보장한다.
 * (StyledComponentsRegistry 가 useServerInsertedHTML 로 SSR 스타일을 주입하므로 함께 동작)
 */
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
