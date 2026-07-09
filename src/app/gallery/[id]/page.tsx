import { ActivityDetail } from '@/features/activities/ActivityDetail';

export const metadata = { title: '활동 상세 — 그리디 허브' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ActivityDetailPage({ params }: Props) {
  const { id } = await params;
  return <ActivityDetail id={id} />;
}
