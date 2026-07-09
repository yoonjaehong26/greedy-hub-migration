import type { Metadata } from 'next';
import { ApiDocsViewer } from '@/features/apiDocs/ApiDocsViewer';

export const metadata: Metadata = {
  title: 'API 명세 — 그리디 허브',
};

export default function DocsPage() {
  return <ApiDocsViewer />;
}
