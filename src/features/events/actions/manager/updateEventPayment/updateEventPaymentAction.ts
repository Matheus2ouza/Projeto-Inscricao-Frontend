'use server';

import { updateEventPaymentService } from '@/features/events/services/manager/updateEventPayment/updateEventPaymentService';
import type {
  UpdateEventPaymentInput,
  UpdateEventPaymentResponse,
} from '@/features/events/types/manager/updateEventPayment/updateEventPaymentTypes';

/**
 * Action: Atualiza o status de pagamento de um evento
 */
export async function updateEventPaymentAction(
  input: UpdateEventPaymentInput,
): Promise<UpdateEventPaymentResponse> {
  return await updateEventPaymentService(input);
}
