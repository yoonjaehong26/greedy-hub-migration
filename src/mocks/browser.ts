/**
 * browser.ts — 브라우저(Service Worker)용 MSW 워커.
 *
 * MswProvider에서 NEXT_PUBLIC_API_MOCK=true 일 때만 동적 import 되어 실행된다.
 */
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
