'use server';

import { registerPaymentPixService } from '@/features/payments/services/registerPayment/registerPaymentPix';
import type {
  RegisterPaymentPixInput,
  RegisterPaymentPixResponse,
} from '@/features/payments/types/registerPayment/registerPaymentPixTypes';

export async function registerPaymentPixAction(
  eventId: string,
  input: RegisterPaymentPixInput,
): Promise<RegisterPaymentPixResponse> {
  const result = await registerPaymentPixService(eventId, input);
  return result;
}
