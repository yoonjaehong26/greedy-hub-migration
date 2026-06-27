import { NextResponse } from 'next/server';
import { getTrackedRepos } from '@/shared/lib/db/trackedReposRepo';
import { fetchRepoPRs } from '@/shared/lib/github/githubApi';
import { upsertMissions } from '@/shared/lib/db/missionsRepo';
import type { Mission } from '@/shared/core/types/mission';

async function runSync(): Promise<{ synced: number; repos: number }> {
  const repos = await getTrackedRepos();
  const syncedAt = new Date().toISOString();

  let total = 0;
  for (const tracked of repos) {
    const prs = await fetchRepoPRs(tracked.repository);
    const missions: Mission[] = prs.map((pr) => ({
      id: `${tracked.repository}#${pr.prNumber}`,
      repository: tracked.repository,
      syncedAt,
      prNumber: pr.prNumber,
      title: pr.title,
      url: pr.url,
      author: pr.author,
      state: pr.state,
      mergedAt: pr.mergedAt,
      createdAt: pr.createdAt,
    }));
    const count = await upsertMissions(missions);
    total += count;
  }

  return { synced: total, repos: repos.length };
}

// POST: UI 수동 트리거
export async function POST() {
  const result = await runSync();
  return NextResponse.json(result);
}

// GET: Vercel Cron (daily)
export async function GET() {
  const result = await runSync();
  return NextResponse.json(result);
}
