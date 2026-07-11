'use server';

import { deleteImageEventService } from '@/features/events/services/manager/deleteImageEvent/deleteImageEventService';

/**
 * Action: Deleta a imagem de um evento
 */
export async function deleteImageEventAction(eventId: string): Promise<void> {
  await deleteImageEventService(eventId);
}
