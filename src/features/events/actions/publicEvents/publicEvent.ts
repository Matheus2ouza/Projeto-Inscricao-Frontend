'use server';

import { Event } from '@/features/events/types/publicEvents/publicEventsTypes';
import { publicEventService } from '../../services/publicEvents/publicEvent';

export async function publicEventAction(slug: string): Promise<Event> {
  const event = await publicEventService(slug);
  return event;
}
