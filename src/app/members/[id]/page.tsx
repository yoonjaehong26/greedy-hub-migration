import { MemberProfile } from '@/features/members/MemberProfile';

export const metadata = { title: '멤버 프로필 — 그리디 허브' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MemberProfilePage({ params }: Props) {
  const { id } = await params;
  return <MemberProfile id={id} />;
}
