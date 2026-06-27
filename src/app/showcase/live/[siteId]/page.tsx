import { LiveViewport } from '@/features/live/LiveViewport';

interface Props {
  params: Promise<{ siteId: string }>;
}

export default async function LivePage({ params }: Props) {
  const { siteId } = await params;
  return <LiveViewport initialSiteId={siteId} />;
}
