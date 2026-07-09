import { NextResponse } from 'next/server';
import { refreshNullScreenshots } from '@/shared/lib/db/sitesRepo';

// 개발용: screenshotUrl이 null인 페이지에 대해 microlink를 재호출합니다.
// POST /api/sites/refresh-screenshots
export async function POST() {
  const updated = await refreshNullScreenshots();
  return NextResponse.json({ updated });
}
