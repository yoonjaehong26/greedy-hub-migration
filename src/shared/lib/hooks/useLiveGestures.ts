'use client';

import { useEffect, useRef } from 'react';
import type { Site } from '@/shared/core/types/site';
import { useLiveViewStore } from '@/shared/core/stores/liveViewStore';

export function useLiveGestures(sites: Site[]) {
  const sitesRef = useRef(sites);
  useEffect(() => { sitesRef.current = sites; }, [sites]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Ignore when user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const store = useLiveViewStore.getState();
      const currentSite = sitesRef.current[store.siteIndex];
      const pageCount = currentSite?.pages.length ?? 1;
      const siteCount = sitesRef.current.length;

      switch (e.key) {
        case 'ArrowLeft':  store.prevPage(pageCount); break;
        case 'ArrowRight': store.nextPage(pageCount); break;
        case 'ArrowUp':    store.prevSite(siteCount); break;
        case 'ArrowDown':  store.nextSite(siteCount); break;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);
}
