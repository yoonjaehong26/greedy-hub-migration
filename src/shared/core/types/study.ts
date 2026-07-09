export type Track = 'FE' | 'BE';
export type WeekStatus = 'DONE' | 'ACTIVE' | 'BREAK';

export interface CurriculumWeek {
  id: number;
  track: Track;
  weekNo: number;
  weekLabel: string;
  title: string;
  status: WeekStatus;
  noteUrl: string | null;
  notionUrl: string | null;
  linkedMissionId: number | null;
}
