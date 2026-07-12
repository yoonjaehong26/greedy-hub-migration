export interface ProjectSummary {
  id: number;
  name: string;
  cohortLabel: string;
  trackLabel: string;
  description: string;
  teamSize: number;
  thumbnailUrl: string | null;
  thumbnailColor: string;
}

export interface ProjectTeamMember {
  memberId: number | null;
  name: string;
  roleLabel: string;
}

export interface ProjectDetail extends ProjectSummary {
  subtitle?: string;
  githubUrl: string | null;
  liveUrl: string | null;
  /** 소개 3블록: 어떤 문제를 풀었나요 */
  problem?: string;
  /** 소개 3블록: 주요 기능 */
  features?: string;
  /** 소개 3블록: 어떻게 만들었나요 */
  how?: string;
  /** 화면 갤러리 이미지들 */
  screenshots?: string[];
  team: ProjectTeamMember[];
  stack: string[];
}
