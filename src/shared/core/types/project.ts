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
  team: ProjectTeamMember[];
  stack: string[];
}
