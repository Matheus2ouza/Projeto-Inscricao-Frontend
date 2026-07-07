import { Event } from '@/features/events/types/publicEvents/publicEventsTypes';
import axiosInstance from '@/shared/lib/apiClient';

export async function getPublicEvent(slug: string): Promise<Event> {
  const { data } = await axiosInstance.get<Event>(`/events/slug/${slug}`);
  return data;
}
