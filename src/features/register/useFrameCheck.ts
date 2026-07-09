'use client';

import { useState, useRef, useCallback } from 'react';

export type FrameStatus = 'idle' | 'checking' | 'allowed' | 'blocked';

const TIMEOUT_MS = 7000;

export function useFrameCheck() {
  const [status, setStatus] = useState<FrameStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (iframeRef.current) {
      try { document.body.removeChild(iframeRef.current); } catch { /* already removed */ }
      iframeRef.current = null;
    }
  }, []);

  // Returns true if blocked, false if allowed
  const check = useCallback(
    (url: string): Promise<boolean> =>
      new Promise((resolve) => {
        setStatus('checking');
        cleanup();

        const iframe = document.createElement('iframe');
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
        iframe.style.cssText =
          'position:fixed;width:0;height:0;opacity:0;pointer-events:none;border:none;';
        iframeRef.current = iframe;
        document.body.appendChild(iframe);

        timerRef.current = setTimeout(() => {
          cleanup();
          setStatus('blocked');
          resolve(true);
        }, TIMEOUT_MS);

        iframe.onload = () => {
          if (timerRef.current) clearTimeout(timerRef.current);
          cleanup();
          setStatus('allowed');
          resolve(false);
        };

        iframe.src = url;
      }),
    [cleanup],
  );

  return { status, check };
}
