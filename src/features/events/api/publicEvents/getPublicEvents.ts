import { Event } from '@/features/events/types/publicEvents/publicEventsTypes';
import axiosInstance from '@/shared/lib/apiClient';

export async function getPublicEvents(): Promise<Event[]> {
  const { data } = await axiosInstance.get<Event[]>('/events/carousel');
  return data;
}
