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

export interface MemberMissionStats {
  author: string;
  total: number;
  merged: number;
  open: number;
  closed: number;
}

export interface RepoMissionStats {
  repository: string;
  totalPRs: number;
  uniqueAuthors: number;
  merged: number;
}
