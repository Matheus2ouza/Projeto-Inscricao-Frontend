'use server';

import { updateEventInscriptionsService } from '@/features/events/services/manager/updateEventInscriptions/updateEventInscriptionsService';
import type {
  UpdateEventInscriptionsInput,
  UpdateEventInscriptionsResponse,
} from '@/features/events/types/manager/updateEventInscriptions/updateEventInscriptionsTypes';

/**
 * Action: Atualiza o status de inscrições de um evento
 */
export async function updateEventInscriptionsAction(
  input: UpdateEventInscriptionsInput,
): Promise<UpdateEventInscriptionsResponse> {
  return await updateEventInscriptionsService(input);
}
