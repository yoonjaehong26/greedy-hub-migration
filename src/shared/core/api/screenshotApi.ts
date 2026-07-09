// Server-side only — do not import in client components
export async function fetchScreenshotUrl(url: string): Promise<string | null> {
  if (process.env.MOCK_SCREENSHOTS === 'true') return null;
  try {
    const endpoint = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&waitUntil=networkidle0&waitFor=7000`;
    const res = await fetch(endpoint, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: { screenshot?: { url?: string } };
    };
    return json?.data?.screenshot?.url ?? null;
  } catch {
    return null;
  }
}
