import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export async function GET() {
  const filePath = path.join(process.cwd(), 'docs', 'openapi.yaml');
  const yaml = await readFile(filePath, 'utf-8');
  return new NextResponse(yaml, {
    headers: { 'Content-Type': 'text/yaml; charset=utf-8' },
  });
}
