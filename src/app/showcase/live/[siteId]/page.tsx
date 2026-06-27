// D 라이브뷰 stub — 카드 탭 시 404 방지용. D 기능 구현 전까지 유지.
export default function LivePage({ params }: { params: { siteId: string } }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', fontFamily: 'sans-serif', color: '#64748b' }}>
      <p>라이브뷰 준비 중 — {params.siteId}</p>
    </div>
  );
}
