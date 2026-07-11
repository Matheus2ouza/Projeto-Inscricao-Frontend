'use server';

import { updateEventService } from '@/features/events/services/manager/updateEvent/updateEventService';
import type {
  UpdateEventInput,
  UpdateEventResponse,
} from '@/features/events/types/manager/updateEvent/updateEventTypes';

/**
 * Action: Atualiza os dados de um evento
 */
export async function updateEventAction(
  eventId: string,
  input: UpdateEventInput,
): Promise<UpdateEventResponse> {
  return await updateEventService(eventId, input);
}
