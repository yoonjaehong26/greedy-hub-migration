'use client';

import { useEffect, useRef } from 'react';
import type { Site } from '@/shared/core/types/site';
import { useLiveViewStore } from '@/shared/core/stores/liveViewStore';

const SWIPE_THRESHOLD = 50;
const WHEEL_THRESHOLD = 30;

export function useLiveGestures(sites: Site[]) {
  // refs prevent stale closures in registered event listeners
  const sitesRef = useRef(sites);
  useEffect(() => { sitesRef.current = sites; }, [sites]);

  useEffect(() => {
    let touchStart: { x: number; y: number } | null = null;

    const handleKey = (e: KeyboardEvent) => {
      const store = useLiveViewStore.getState();
      if (store.isInteractive) return;

      const currentSite = sitesRef.current[store.siteIndex];
      const pageCount = currentSite?.pages.length ?? 1;
      const siteCount = sitesRef.current.length;

      switch (e.key) {
        case 'ArrowLeft': store.prevPage(pageCount); break;
        case 'ArrowRight': store.nextPage(pageCount); break;
        case 'ArrowUp': store.prevSite(siteCount); break;
        case 'ArrowDown': store.nextSite(siteCount); break;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const store = useLiveViewStore.getState();
      if (store.isInteractive) return;

      const isVertical = Math.abs(e.deltaY) >= Math.abs(e.deltaX);
      if (!isVertical || Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

      e.preventDefault();
      const siteCount = sitesRef.current.length;
      if (e.deltaY > 0) store.nextSite(siteCount);
      else store.prevSite(siteCount);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (useLiveViewStore.getState().isInteractive) return;
      const t = e.touches[0];
      touchStart = { x: t.clientX, y: t.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (useLiveViewStore.getState().isInteractive || !touchStart) return;

      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      touchStart = null;

      const store = useLiveViewStore.getState();
      const currentSite = sitesRef.current[store.siteIndex];
      const pageCount = currentSite?.pages.length ?? 1;
      const siteCount = sitesRef.current.length;

      if (Math.abs(dy) >= Math.abs(dx) && Math.abs(dy) > SWIPE_THRESHOLD) {
        if (dy < 0) store.nextSite(siteCount);
        else store.prevSite(siteCount);
      } else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
        if (dx < 0) store.nextPage(pageCount);
        else store.prevPage(pageCount);
      }
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []); // Register once — refs handle dynamic values
}
