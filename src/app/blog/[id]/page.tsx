import Link from 'next/link';

export const metadata = { title: '상태관리 미션, Zustand로 다시 짜며 배운 것 — 그리디 허브' };

export default function BlogDetailPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/blog" className="text-sm text-slate-500 hover:text-brand">
        ← 기술블로그
      </Link>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10">회고</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10">React</span>
      </div>
      <div className="mt-3 flex items-start gap-3">
        <h1 className="text-3xl font-extrabold leading-tight flex-1">
          상태관리 미션, Zustand로 다시 짜며 배운 것
        </h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300 shrink-0 mt-2">공개 화면</span>
      </div>
      <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
        <Link href="/members/1" className="flex items-center gap-2 hover:text-brand">
          <span className="w-8 h-8 rounded-full bg-slate-300 dark:bg-white/20" />
          박지호
        </Link>
        <span>· FE 4기 · 3일 전</span>
      </div>

      <article className="mt-8 space-y-4 leading-relaxed text-slate-700 dark:text-slate-300">
        <p>
          이번 미션에서 Context API로 짜뒀던 전역 상태를 Zustand로 옮겼다. 처음엔 &quot;그냥 되는데 왜
          바꾸지?&quot; 싶었는데, 리뷰어와 티키타카하면서 생각이 바뀌었다.
        </p>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">왜 Context가 불편했나</h2>
        <p>
          Context는 값이 바뀌면 구독하는 컴포넌트가 전부 리렌더된다. 작은 앱에선 괜찮지만 미션
          규모가 커지자…
        </p>
        <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 text-sm overflow-x-auto">
          <code>{`const useCartStore = create((set) => ({
  items: [],
  add: (p) => set((s) => ({ items: [...s.items, p] })),
}))`}</code>
        </pre>
        <p>selector로 필요한 조각만 구독하니 리렌더가 확 줄었다. 이 부분을 리뷰어가 짚어줘서 알았다.</p>
        <blockquote className="border-s-4 border-brand pl-4 italic text-slate-600 dark:text-slate-400">
          &quot;왜 이 store를 이렇게 나눴어요?&quot; — 이 질문 하나가 설계를 다시 보게 했다.
        </blockquote>
        <p>
          결국 중요한 건 도구가 아니라 <b>선택의 근거</b>였다. 다음 미션에도 이 습관을 가져가려 한다.
        </p>
      </article>

      <section className="mt-10 border-t border-slate-900/5 dark:border-white/10 pt-6">
        <h3 className="font-bold mb-4">댓글 1</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <span className="w-8 h-8 rounded-full bg-slate-300 dark:bg-white/20 shrink-0" />
            <div className="rounded-xl bg-white dark:bg-slate-800/70 ring-1 ring-slate-900/5 dark:ring-white/10 p-3 text-sm">
              <b>정우진</b> <span className="text-slate-400">· 리뷰어</span>
              <p className="mt-1">selector 부분 깔끔하게 정리됐네요 👍</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
