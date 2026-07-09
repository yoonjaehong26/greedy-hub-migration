/**
 * mongodb.ts — MongoClient 연결 싱글턴
 *
 * 개발 모드(HMR)에서 매 리로드마다 새 커넥션이 생기는 것을 막기 위해 globalThis 에 promise 를 캐시한다.
 * 프로덕션에서는 모듈 스코프 단일 인스턴스로 충분.
 * 사용처: shared/lib/db/*Repo.ts (DB 접근은 이 레이어에서만).
 */
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}

export default clientPromise;
