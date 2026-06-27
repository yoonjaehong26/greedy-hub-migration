export const metadata = { title: '지원 — 그리디 허브' };

export default function RecruitPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">4기 지원</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300">공개 화면</span>
      </div>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        재학생·휴학생 누구나. 에타 공고를 보고 오셨다면 여기서 바로 지원하세요.
      </p>

      {/* 전형 안내 */}
      <div className="mt-6 rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-5">
        <div className="text-sm font-semibold text-slate-500 mb-3">전형 안내</div>
        <ol className="space-y-3 text-sm">
          {[
            { n: 1, title: '지원서 제출', desc: '아래 폼을 작성해 주세요.' },
            { n: 2, title: '서류 심사', desc: <>합격하시면 <b className="text-brand">입력하신 연락처로 개별 안내</b>드립니다.</> },
            { n: 3, title: '면접 · 최종 결과', desc: '면접 일정과 최종 합격 여부도 개별적으로 연락드려요.' },
          ].map((s) => (
            <li key={s.n} className="flex gap-3">
              <span className="w-6 h-6 shrink-0 rounded-full bg-brand text-white grid place-items-center font-bold text-xs">
                {s.n}
              </span>
              <div>
                <b>{s.title}</b> — {s.desc}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* 폼 */}
      <form className="mt-8 rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">이름</label>
          <input
            className="w-full rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none"
            placeholder="홍길동"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">학번 / 학과</label>
            <input
              className="w-full rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none"
              placeholder="컴퓨터공학과"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">희망 트랙</label>
            <select className="w-full rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none">
              <option>프론트엔드 (FE)</option>
              <option>백엔드 (BE)</option>
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              이메일 <span className="text-slate-400">(결과 안내용)</span>
            </label>
            <input
              type="email"
              className="w-full rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              디스코드 ID <span className="text-slate-400">(선택)</span>
            </label>
            <input
              className="w-full rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none"
              placeholder="username"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">GitHub (선택)</label>
          <input
            className="w-full rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none"
            placeholder="github.com/..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">지원 동기</label>
          <textarea
            rows={4}
            className="w-full rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-white/10 outline-none resize-none"
            placeholder="개발을 꾸준히 하고 싶은 이유를 적어주세요"
          />
        </div>
        <label className="flex items-start gap-2 text-sm text-slate-500">
          <input type="checkbox" className="mt-1" />
          제출한 정보가 심사 목적으로 저장되는 것에 동의합니다.
        </label>
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-soft"
        >
          지원서 제출
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-400">
        결과는 입력하신 연락처로 <b>개별 안내</b>드립니다. (사이트 실시간 상태 조회는 제공하지
        않아요)
      </p>
    </main>
  );
}
