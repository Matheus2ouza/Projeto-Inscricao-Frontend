'use server';

import { deleteEventResponsibleService } from '@/features/events/services/manager/deleteEventResponsible/deleteEventResponsibleService';

/**
 * Action: Remove um responsável de um evento
 */
export async function deleteEventResponsibleAction(
  eventId: string,
  accountId: string,
): Promise<void> {
  await deleteEventResponsibleService(eventId, accountId);
}
