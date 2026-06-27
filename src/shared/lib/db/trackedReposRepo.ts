import type { Collection, Document } from 'mongodb';
import { nanoid } from 'nanoid';
import clientPromise from './mongodb';
import type { TrackedRepo } from '@/shared/core/types/mission';

const DB_NAME = process.env.MONGODB_DB ?? 'greedy-hub';
const COLLECTION = 'trackedRepos';

const SEED_REPOS = [
  // 1~3주차: JavaScript 기초
  'greedy-team/javascript-baseball-precourse',
  'greedy-team/javascript-greedy-roulette',
  'greedy-team/javascript-zombie-survival',
  // 4~5주차: React 기초 (cho-log 공동 운영)
  'cho-log/self-paced-react',
  // 6~9주차: React 심화
  'greedy-team/self-paced-react-advanced',
  // 10~12주차: 무엇이든 만들어보세요
  'greedy-team/react-whatever-you-want',
  // 13~14주차: SSR
  'greedy-team/react-pokemon-ssr',
];

async function getCollection(): Promise<Collection> {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(COLLECTION);
}

function toTrackedRepo(doc: Document): TrackedRepo {
  const { _id: _, ...rest } = doc;
  return rest as TrackedRepo;
}

export async function getTrackedRepos(): Promise<TrackedRepo[]> {
  await ensureSeeded();
  const col = await getCollection();
  const docs = await col.find({}).toArray();
  return docs.map(toTrackedRepo);
}

async function ensureSeeded(): Promise<void> {
  const col = await getCollection();
  await col.createIndex({ repository: 1 }, { unique: true });

  const now = new Date().toISOString();
  for (const repo of SEED_REPOS) {
    await col.updateOne(
      { repository: repo },
      { $setOnInsert: { id: nanoid(), repository: repo, addedAt: now } as Document },
      { upsert: true },
    );
  }
}
