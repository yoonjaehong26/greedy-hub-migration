export interface Mission {
  id: string; // `${repository}#${prNumber}` — upsert key
  prNumber: number;
  title: string;
  url: string;
  author: string;
  state: 'open' | 'merged' | 'closed';
  repository: string; // "org/repo"
  mergedAt: string | null;
  createdAt: string; // GitHub PR 생성 시각 (ISO)
  syncedAt: string;  // 마지막 sync 시각 (ISO)
}

export interface TrackedRepo {
  id: string;
  repository: string; // "org/repo"
  addedAt: string;
}
