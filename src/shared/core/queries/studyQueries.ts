import { useQuery } from '@tanstack/react-query';
import { getCurriculum } from '@/shared/core/api/studyApi';
import type { Track } from '@/shared/core/types/study';

export function useCurriculumQuery(track: Track) {
  return useQuery({
    queryKey: ['study', 'curriculum', track] as const,
    queryFn: () => getCurriculum(track),
  });
}
