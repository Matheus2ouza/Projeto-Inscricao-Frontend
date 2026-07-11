'use server';

import { updateAllowCardService } from '@/features/events/services/manager/updateAllowCard/updateAllowCardService';
import { Event } from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';

/**
 * Action: Atualiza a permissão de cartão de um evento
 */
export async function updateAllowCardAction(
  eventId: string,
  allowCard: boolean,
): Promise<Event> {
  return await updateAllowCardService(eventId, allowCard);
}
