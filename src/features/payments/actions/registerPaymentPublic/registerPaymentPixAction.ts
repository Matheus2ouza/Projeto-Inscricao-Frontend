'use server';

import { registerPaymentPixService } from '@/features/payments/services/registerPaymentPublic/registerPaymentPix';
import type {
  RegisterPaymentPixInput,
  RegisterPaymentPixResponse,
} from '@/features/payments/types/registerPaymentPublic/registerPaymentPixTypes';

export async function registerPaymentPixAction(
  input: RegisterPaymentPixInput,
): Promise<RegisterPaymentPixResponse> {
  const result = await registerPaymentPixService(input);
  return result;
}
