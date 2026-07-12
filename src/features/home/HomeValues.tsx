const VALUES = [
  { title: 'OPEN', desc: '모든 정보를 투명하고 공개적으로' },
  { title: 'KINDNESS', desc: '모두에게 친절하고 따뜻하게' },
  { title: 'TOLERANCE', desc: '다름을 자연스러운 것으로' },
  { title: 'HUMAN COMMUNITY', desc: '사람 사는 공동체답게' },
];

export function HomeValues() {
  return (
    <section className="bg-brand px-5 py-16 md:py-[88px]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:gap-14">
        <h2 className="text-xl text-white">그리디가 지키는 것</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-11">
          {VALUES.map((v) => (
            <div key={v.title} className="flex flex-col gap-2">
              <p className="text-2xl text-white">{v.title}</p>
              <p className="text-sm text-[#c0e4da]">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
