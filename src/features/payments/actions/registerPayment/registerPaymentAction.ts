import {
  RegisterPaymentInput,
  RegisterPaymentResponse,
} from '@/features/payments/types/registerPayment/registerPaymentTypes';
import { registerPaymentService } from '../../services/registerPayment/registerPaymentService';

export async function registerPaymentAction(
  eventId: string,
  input: RegisterPaymentInput,
): Promise<RegisterPaymentResponse> {
  const result = await registerPaymentService(eventId, input);
  return result;
}
