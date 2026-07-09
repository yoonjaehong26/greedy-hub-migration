/**
 * server.ts — Node(vitest)용 MSW 서버.
 *
 * 브라우저 서비스워커 없이 핸들러 계약을 테스트하기 위한 용도.
 */
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
