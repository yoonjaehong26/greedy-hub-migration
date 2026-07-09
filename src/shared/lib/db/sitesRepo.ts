import type { Collection, Document } from 'mongodb';
import { nanoid } from 'nanoid';
import clientPromise from './mongodb';
import type { Site, Page } from '@/shared/core/types/site';
import { getCurrentUserId } from './usersRepo';
import { SEED_SITES } from './seedData';
import { fetchScreenshotUrl } from '@/shared/core/api/screenshotApi';

const THUMBNAIL_COLORS = [
  '#017356', '#7C3AED', '#0EA5E9', '#F59E0B',
  '#EF4444', '#10B981', '#F97316', '#8B5CF6',
];

function colorFromDomain(domain: string): string {
  let hash = 0;
  for (const char of domain) hash = ((hash * 31) + char.charCodeAt(0)) >>> 0;
  return THUMBNAIL_COLORS[hash % THUMBNAIL_COLORS.length];
}

export interface CreateSiteInput {
  url: string;
  frameBlocked: boolean;
  screenshotUrl: string | null;
}

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

export async function refreshNullScreenshots(): Promise<number> {
  const col = await getCollection();
  const docs = await col.find({ 'pages.screenshotUrl': null }).toArray();

  let updated = 0;
  for (const doc of docs) {
    const newPages = await Promise.all(
      (doc.pages as Page[]).map(async (p) => {
        if (p.screenshotUrl !== null) return p;
        const url = await fetchScreenshotUrl(p.url);
        return url ? { ...p, screenshotUrl: url } : p;
      }),
    );
    const changed = newPages.some((p, i) => p.screenshotUrl !== (doc.pages as Page[])[i].screenshotUrl);
    if (changed) {
      await col.updateOne({ _id: doc._id }, { $set: { pages: newPages } });
      updated++;
    }
  }
  return updated;
}

export async function createSite(input: CreateSiteInput): Promise<Site> {
  const col = await getCollection();
  const now = new Date().toISOString();
  const ownerId = getCurrentUserId();

  const parsed = new URL(input.url);
  const domain = parsed.hostname.replace(/^www\./, '');

  const homePage: Page = {
    pageId: nanoid(),
    label: '홈',
    url: input.url,
    isHome: true,
    frameBlocked: input.frameBlocked,
    frameCheckedAt: now,
    screenshotUrl: input.screenshotUrl,
    ogDescription: null,
  };

  const site: Site = {
    id: nanoid(),
    ownerId,
    title: domain,
    description: '',
    domain,
    thumbnailColor: colorFromDomain(domain),
    pages: [homePage],
    status: 'live',
    createdAt: now,
    updatedAt: now,
  };

  await col.insertOne(site as Document);
  return site;
}
