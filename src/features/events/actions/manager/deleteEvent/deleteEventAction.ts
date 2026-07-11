'use server';

import { deleteEventService } from '@/features/events/services/manager/deleteEvent/deleteEventService';

/**
 * Action: Deleta um evento
 */
export async function deleteEventAction(eventId: string): Promise<void> {
  await deleteEventService(eventId);
}
