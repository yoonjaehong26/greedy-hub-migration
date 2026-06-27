import { NextResponse } from 'next/server';
import { getSites } from '@/shared/lib/db/sitesRepo';

export async function GET() {
  const sites = await getSites();
  const live = sites.filter((s) => s.status === 'live');
  return NextResponse.json(live);
}
