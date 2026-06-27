import { NextResponse } from 'next/server';
import { getMissions } from '@/shared/lib/db/missionsRepo';

export async function GET() {
  const missions = await getMissions();
  return NextResponse.json(missions);
}
