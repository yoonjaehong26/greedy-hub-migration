interface GitHubPRResponse {
  number: number;
  title: string;
  html_url: string;
  user: { login: string };
  state: 'open' | 'closed';
  merged_at: string | null;
  created_at: string;
}

export interface FetchedPR {
  prNumber: number;
  title: string;
  url: string;
  author: string;
  state: 'open' | 'merged' | 'closed';
  mergedAt: string | null;
  createdAt: string;
}

export async function fetchRepoPRs(repository: string): Promise<FetchedPR[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const prs: FetchedPR[] = [];
  let page = 1;

  while (true) {
    const url = `https://api.github.com/repos/${repository}/pulls?state=all&per_page=100&page=${page}`;
    const res = await fetch(url, { headers, cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`GitHub API ${res.status} for ${repository} (page ${page})`);
    }

    const data = (await res.json()) as GitHubPRResponse[];
    if (data.length === 0) break;

    for (const pr of data) {
      const isMerged = pr.merged_at != null;
      prs.push({
        prNumber: pr.number,
        title: pr.title,
        url: pr.html_url,
        author: pr.user.login,
        state: isMerged ? 'merged' : pr.state,
        mergedAt: pr.merged_at,
        createdAt: pr.created_at,
      });
    }

    const linkHeader = res.headers.get('Link') ?? '';
    if (!linkHeader.includes('rel="next"')) break;
    page++;
  }

  return prs;
}
