import Link from 'next/link';

export const metadata = { title: '기술블로그 — 그리디 허브' };

const POSTS = [
  { tags: ['회고', 'React'], title: '상태관리 미션, Zustand로 다시 짜며 배운 것', author: '박지호', track: 'FE 4기', when: '3일 전' },
  { tags: ['기술', 'Spring'], title: 'N+1 쿼리, 리뷰에서 잡힌 그날의 기록', author: '이서연', track: 'BE 4기', when: '1주 전' },
  { tags: ['취업'], title: '그리디 활동을 이력서로 정리한 방법', author: '최예린', track: 'FE 2기', when: '2주 전' },
  { tags: ['트러블슈팅', 'CORS'], title: '로컬에선 되는데 배포만 하면 막히던 CORS', author: '권태양', track: 'BE 4기', when: '3주 전' },
  { tags: ['기술', 'JPA'], title: '연관관계 매핑, 언제 단방향/양방향?', author: '배현우', track: 'BE 4기', when: '3주 전' },
  { tags: ['회고'], title: '첫 미션 PR, 리뷰 30개 받고 느낀 것', author: '문서윤', track: 'FE 4기', when: '한 달 전' },
];

const TAGS = ['전체', '회고', '기술', '취업', '트러블슈팅'];

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold">기술블로그</h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300">
              공개 화면
            </span>
          </div>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            쓰면 동아리에 기여되고, 내 이력으로 남습니다.
          </p>
        </div>
        <Link
          href="/blog/write"
          className="px-4 py-2 rounded-lg bg-brand text-white font-semibold text-sm"
        >
          글쓰기
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        {TAGS.map((t, i) => (
          <button
            key={t}
            className={`px-3 py-1.5 rounded-full ${i === 0 ? 'bg-brand text-white' : 'bg-white dark:bg-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-5">
        {POSTS.map((p) => (
          <Link
            key={p.title}
            href="/blog/1"
            className="rounded-2xl bg-white dark:bg-slate-800/70 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 p-6 hover:-translate-y-0.5 transition block"
          >
            <div className="flex gap-2 mb-3">
              {p.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10">
                  {t}
                </span>
              ))}
            </div>
            <h3 className="font-semibold leading-snug">{p.title}</h3>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <span className="w-6 h-6 rounded-full bg-slate-300 dark:bg-white/20" />
              {p.author} · {p.track} · {p.when}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
