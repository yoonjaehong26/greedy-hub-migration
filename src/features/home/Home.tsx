import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { HomeStats } from './HomeStats';
import { HomeJourney } from './HomeJourney';
import { HomeActivitiesPreview } from './HomeActivitiesPreview';
import { HomeProjectsPreview } from './HomeProjectsPreview';
import { HomeValues } from './HomeValues';

export function Home() {
  return (
    <main>
      <section className="flex flex-col items-center gap-10 bg-brand px-5 py-16 md:flex-row md:justify-between md:px-[120px] md:py-24">
        <div className="flex max-w-xl flex-col items-start gap-5 text-center md:text-left">
          <Badge variant="white">5기 모집 중</Badge>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-[56px]">
            교내 개발 생태계의
            <br />
            선한 영향력을
          </h1>
          <p className="text-base leading-relaxed text-[#c0e4da]">
            세종대학교 개발 동아리 그리디예요.
            <br />
            스터디와 리뷰, 프로젝트로 함께 성장해요.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Button href="/recruit" variant="white" size="lg">
              지원하기
            </Button>
            <Button href="/gallery" variant="outline-white" size="lg">
              활동 보기
            </Button>
          </div>
          <p className="text-xs text-[#c0e4da]">서류 접수 안내는 지원 페이지를 확인해주세요</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="그리디 로고" className="size-48 shrink-0 object-contain md:size-[360px]" />
      </section>

      <HomeStats />
      <HomeJourney />
      <HomeActivitiesPreview />
      <HomeProjectsPreview />
      <HomeValues />
    </main>
  );
}
