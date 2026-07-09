/**
 * vitest.config.ts — 단위 테스트 러너 설정
 *
 * @/ alias 를 tsconfig 와 동일하게 매핑하고 React 컴포넌트 테스트를 위한 plugin-react 를 켠다.
 * 환경 기본값은 node — DOM 이 필요한 테스트는 파일 상단에 // @vitest-environment jsdom 로 개별 지정.
 */
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    globals: true,
  },
});
