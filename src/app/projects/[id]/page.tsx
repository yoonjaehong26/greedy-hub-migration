import { ProjectDetail } from '@/features/projects/ProjectDetail';

export const metadata = { title: '프로젝트 상세 — 그리디 허브' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  return <ProjectDetail id={id} />;
}
