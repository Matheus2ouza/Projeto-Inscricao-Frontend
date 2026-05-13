import { Event } from '@/features/events/types/publicEvents/publicEventsTypes';
import axiosInstance from '@/shared/lib/apiClient';

export async function getPublicEvent(eventId: string): Promise<Event> {
  const { data } = await axiosInstance.get<Event>(`/events/${eventId}`);
  return data;
}
