import type { Collection, Document } from 'mongodb';
import { nanoid } from 'nanoid';
import clientPromise from './mongodb';
import type { Site, Page } from '@/shared/core/types/site';
import { getCurrentUserId } from './usersRepo';
import { SEED_SITES } from './seedData';

const DB_NAME = process.env.MONGODB_DB ?? 'greedy-hub';
const COLLECTION = 'sites';

async function getCollection(): Promise<Collection> {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(COLLECTION);
}

function toSite(doc: Document): Site {
  const { _id: _, ...rest } = doc;
  return rest as Site;
}

export async function getSites(): Promise<Site[]> {
  await ensureSeeded();
  const col = await getCollection();
  const docs = await col.find({}, { sort: { createdAt: -1 } }).toArray();
  return docs.map(toSite);
}

export async function ensureSeeded(): Promise<void> {
  const col = await getCollection();
  const count = await col.countDocuments();
  if (count > 0) return;

  const now = new Date().toISOString();
  const ownerId = getCurrentUserId();

  const docs = SEED_SITES.map((s) => {
    const url = new URL(s.homeUrl);
    const domain = url.hostname.replace(/^www\./, '');

    const homePage: Page = {
      pageId: nanoid(),
      label: '홈',
      url: s.homeUrl,
      isHome: true,
      frameBlocked: s.frameBlocked,
      frameCheckedAt: now,
      screenshotUrl: null,
      ogDescription: null,
    };

    return {
      id: nanoid(),
      ownerId,
      title: s.title,
      description: s.description,
      domain,
      thumbnailColor: s.thumbnailColor,
      pages: [homePage],
      status: 'live' as const,
      createdAt: now,
      updatedAt: now,
    };
  });

  await col.insertMany(docs as Document[]);
}
