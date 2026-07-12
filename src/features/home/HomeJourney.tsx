const STAGES = [
  { no: 1, title: '스터디', desc: '트랙별 커리큘럼으로 매주 미션을 구현해요' },
  { no: 2, title: '코드 리뷰', desc: '리뷰어와 티키타카하며 코드를 다듬어요' },
  { no: 3, title: '팀 프로젝트', desc: '팀을 꾸려 실제 서비스를 만들어요' },
  { no: 4, title: '데모데이', desc: '2주마다 발표하고 서로의 성장을 확인해요' },
];

export function HomeJourney() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="mb-8 flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-slate-100">그리디의 한 학기</h2>
        <p className="text-sm text-neutral-500 dark:text-slate-400">
          스터디에서 데모데이까지, 이렇게 성장해요
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {STAGES.map((s) => (
          <div key={s.no} className="flex flex-col gap-3 rounded-[20px] bg-neutral-50 p-6 dark:bg-slate-800/40">
            <span className="flex size-8 items-center justify-center rounded-full bg-brand-50 text-[15px] font-bold text-brand-700">
              {s.no}
            </span>
            <p className="text-lg font-semibold text-neutral-900 dark:text-slate-100">{s.title}</p>
            <p className="text-sm leading-relaxed text-neutral-500 dark:text-slate-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
