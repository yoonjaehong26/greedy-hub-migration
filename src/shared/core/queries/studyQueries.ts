import { useQuery } from '@tanstack/react-query';
import { getCurriculum } from '@/shared/core/api/studyApi';

export const CURRICULUM_QUERY_KEY = ['curriculum'] as const;

export function useCurriculumQuery() {
  return useQuery({
    queryKey: CURRICULUM_QUERY_KEY,
    queryFn: getCurriculum,
  });
}
