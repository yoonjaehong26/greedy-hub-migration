import { create } from 'zustand';

function computeVisible(current: number, total: number): number[] {
  const result = [current];
  if (current + 1 < total) result.push(current + 1);
  return result;
}

interface LiveViewState {
  siteIndex: number;
  pageIndex: number;
  visibleIndices: number[];

  initSite: (index: number, total: number) => void;
  nextSite: (total: number) => void;
  prevSite: (total: number) => void;
  setPage: (i: number) => void;
  nextPage: (pageCount: number) => void;
  prevPage: (pageCount: number) => void;
}

export const useLiveViewStore = create<LiveViewState>((set) => ({
  siteIndex: 0,
  pageIndex: 0,
  visibleIndices: [0],

  initSite: (index, total) =>
    set({ siteIndex: index, pageIndex: 0, visibleIndices: computeVisible(index, total) }),

  nextSite: (total) =>
    set((s) => {
      const next = (s.siteIndex + 1) % total;
      return { siteIndex: next, pageIndex: 0, visibleIndices: computeVisible(next, total) };
    }),

  prevSite: (total) =>
    set((s) => {
      const prev = (s.siteIndex - 1 + total) % total;
      return { siteIndex: prev, pageIndex: 0, visibleIndices: computeVisible(prev, total) };
    }),

  setPage: (i) => set({ pageIndex: i }),

  nextPage: (pageCount) => set((s) => ({ pageIndex: (s.pageIndex + 1) % pageCount })),

  prevPage: (pageCount) => set((s) => ({ pageIndex: (s.pageIndex - 1 + pageCount) % pageCount })),
}));
