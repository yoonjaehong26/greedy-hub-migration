import type { Collection, Document } from 'mongodb';
import { nanoid } from 'nanoid';
import clientPromise from './mongodb';
import type { TrackedRepo } from '@/shared/core/types/mission';

const DB_NAME = process.env.MONGODB_DB ?? 'greedy-hub';
const COLLECTION = 'trackedRepos';

const SEED_REPOS = [
  // ── 3기 프론트 ──
  'greedy-team/javascript-baseball-precourse', // 숫자야구
  'cho-log/self-paced-react',                  // React 기초 (cho-log 공동 운영)
  'greedy-team/self-paced-react-advanced',     // React 심화
  'greedy-team/react-spa-routing',             // SPA 라우팅 (newsViewer)
  'greedy-team/react-todo-list',               // Todo (렌더링 최적화)
  // ── 3기 백엔드 (nextstep 공용 레포 — public, 명부로 귀속) ──
  'next-step/java-racingcar-simple-playground',
  'next-step/java-lotto-clean-playground',
  'next-step/spring-basic-roomescape-playground',
  // ── 4기 프론트 (파일럿 범위 밖 · 추후 카탈로그 추가 시 사용) ──
  'greedy-team/javascript-greedy-roulette',
  'greedy-team/javascript-zombie-survival',
  'greedy-team/react-whatever-you-want',
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
