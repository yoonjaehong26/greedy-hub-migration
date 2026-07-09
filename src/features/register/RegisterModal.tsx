'use client';

import { useState, useCallback } from 'react';
import { useCreateSiteMutation } from '@/shared/core/queries/siteQueries';
import { useFrameCheck } from './useFrameCheck';

interface Props {
  onClose: () => void;
}

export function RegisterModal({ onClose }: Props) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { status: frameStatus, check } = useFrameCheck();
  const mutation = useCreateSiteMutation();

  const isChecking = frameStatus === 'checking';
  const isPending = isChecking || mutation.isPending;

  const submit = useCallback(async () => {
    setError(null);

    let finalUrl: string;
    try {
      const raw = url.trim();
      finalUrl = new URL(raw.startsWith('http') ? raw : `https://${raw}`).href;
    } catch {
      setError('올바른 URL을 입력해 주세요');
      return;
    }

    const frameBlocked = await check(finalUrl);

    try {
      await mutation.mutateAsync({ url: finalUrl, frameBlocked });
      onClose();
    } catch {
      setError('등록에 실패했어요. 잠시 후 다시 시도해 주세요.');
    }
  }, [url, check, mutation, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card — follows prototype card style */}
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-xl ring-1 ring-slate-900/10 dark:ring-white/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            프로젝트 등록
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 -mr-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="register-url"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              사이트 URL
            </label>
            <input
              id="register-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isPending && submit()}
              placeholder="https://example.com"
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
            />
            <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
              http:// 없이 입력해도 됩니다
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          {isChecking && (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <svg className="w-4 h-4 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              iframe 호환 여부 확인 중…
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              취소
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!url.trim() || isPending}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand text-white hover:bg-brand-soft disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isPending ? '처리 중…' : '등록'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
