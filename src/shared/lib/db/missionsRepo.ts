import type { Collection, Document, AnyBulkWriteOperation } from 'mongodb';
import clientPromise from './mongodb';
import type { Mission } from '@/shared/core/types/mission';

const DB_NAME = process.env.MONGODB_DB ?? 'greedy-hub';
const COLLECTION = 'missions';

async function getCollection(): Promise<Collection> {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(COLLECTION);
}

function toMission(doc: Document): Mission {
  const { _id: _, ...rest } = doc;
  return rest as Mission;
}

export async function getMissions(): Promise<Mission[]> {
  const col = await getCollection();
  const docs = await col.find({}, { sort: { createdAt: -1 } }).toArray();
  return docs.map(toMission);
}

export async function upsertMissions(missions: Mission[]): Promise<number> {
  if (missions.length === 0) return 0;
  const col = await getCollection();

  await col.createIndex({ id: 1 }, { unique: true });

  const ops: AnyBulkWriteOperation[] = missions.map((m) => ({
    replaceOne: {
      filter: { id: m.id },
      replacement: m as Document,
      upsert: true,
    },
  }));

  const result = await col.bulkWrite(ops);
  return result.upsertedCount + result.modifiedCount;
}
