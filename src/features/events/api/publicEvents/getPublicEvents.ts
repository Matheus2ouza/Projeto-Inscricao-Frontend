import { Event } from '@/features/events/types/publicEvents/publicEventsTypes';

function resolveApiUrl(pathname: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return pathname;
  return new URL(pathname, baseUrl).toString();
}

export async function getPublicEvents(): Promise<Event[]> {
  const res = await fetch(resolveApiUrl('/events/carousel'), {
    method: 'GET',
    cache: 'no-store',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(`getPublicEvents failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as Event[];
}
