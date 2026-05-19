import { Event } from '@/features/events/types/publicEvents/publicEventsTypes';

function resolveApiUrl(pathname: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) return pathname;

  return new URL(pathname, baseUrl).toString();
}

export async function getPublicEvents(): Promise<Event[]> {
  try {
    const res = await fetch(resolveApiUrl('/events/carousel'), {
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
    });

    if (!res.ok) {
      console.error(`getPublicEvents failed: ${res.status} ${res.statusText}`);

      return [];
    }

    return (await res.json()) as Event[];
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);

    return [];
  }
}
