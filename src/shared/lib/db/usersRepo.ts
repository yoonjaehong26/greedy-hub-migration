export const ME_USER_ID = 'user-me-001';

// 향후 그리디 세션 연동 시 이 한 줄만 교체
export function getCurrentUserId(): string {
  return ME_USER_ID;
}
