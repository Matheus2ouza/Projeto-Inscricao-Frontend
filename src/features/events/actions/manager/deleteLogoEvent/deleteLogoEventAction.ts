'use server';

import { deleteLogoEventService } from '@/features/events/services/manager/deleteLogoEvent/deleteLogoEventService';

/**
 * Action: Deleta o logo de um evento
 */
export async function deleteLogoEventAction(eventId: string): Promise<void> {
  await deleteLogoEventService(eventId);
}
