import { NextResponse } from 'next/server';
import { getSites, createSite } from '@/shared/lib/db/sitesRepo';
import { fetchScreenshotUrl } from '@/shared/core/api/screenshotApi';

export async function GET() {
  const sites = await getSites();
  const live = sites.filter((s) => s.status === 'live');
  return NextResponse.json(live);
}

export async function POST(req: Request) {
  const body = (await req.json()) as { url?: string; frameBlocked?: boolean };

  if (!body.url) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 });
  }

  try {
    new URL(body.url);
  } catch {
    return NextResponse.json({ error: 'invalid URL' }, { status: 400 });
  }

  const screenshotUrl = await fetchScreenshotUrl(body.url);
  const site = await createSite({
    url: body.url,
    frameBlocked: body.frameBlocked ?? false,
    screenshotUrl,
  });

  return NextResponse.json(site, { status: 201 });
}
