import { create } from 'zustand';

// visibleIndices: 현재 마운트된 iframe 인덱스 목록 (최대 2 — 메모리 절약)
function computeVisible(current: number, total: number): number[] {
  const result = [current];
  if (current + 1 < total) result.push(current + 1);
  return result;
}

interface LiveViewState {
  siteIndex: number;
  pageIndex: number;
  isInteractive: boolean;
  visibleIndices: number[];

  initSite: (index: number, total: number) => void;
  nextSite: (total: number) => void;
  prevSite: (total: number) => void;
  setPage: (i: number) => void;
  nextPage: (pageCount: number) => void;
  prevPage: (pageCount: number) => void;
  setInteractive: (v: boolean) => void;
}

export const useLiveViewStore = create<LiveViewState>((set) => ({
  siteIndex: 0,
  pageIndex: 0,
  isInteractive: false,
  visibleIndices: [0],

  initSite: (index, total) =>
    set({ siteIndex: index, pageIndex: 0, visibleIndices: computeVisible(index, total), isInteractive: false }),

  nextSite: (total) =>
    set((s) => {
      const next = (s.siteIndex + 1) % total;
      return { siteIndex: next, pageIndex: 0, visibleIndices: computeVisible(next, total), isInteractive: false };
    }),

  prevSite: (total) =>
    set((s) => {
      const prev = (s.siteIndex - 1 + total) % total;
      return { siteIndex: prev, pageIndex: 0, visibleIndices: computeVisible(prev, total), isInteractive: false };
    }),

  setPage: (i) => set({ pageIndex: i }),

  nextPage: (pageCount) => set((s) => ({ pageIndex: (s.pageIndex + 1) % pageCount })),

  prevPage: (pageCount) => set((s) => ({ pageIndex: (s.pageIndex - 1 + pageCount) % pageCount })),

  setInteractive: (v) => set({ isInteractive: v }),
}));
