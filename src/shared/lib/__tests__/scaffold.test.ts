/**
 * scaffold.test.ts — 스캐폴드 스모크 테스트
 *
 * vitest 러너와 @/ alias 해석이 정상 동작하는지 확인하는 최소 테스트.
 * 실제 기능 테스트가 추가되면 삭제해도 무방.
 */
import { describe, expect, it } from 'vitest';

describe('scaffold smoke', () => {
  it('테스트 러너가 동작한다', () => {
    expect(1 + 1).toBe(2);
  });
});
