'use server';

import { deletePaymentService } from '@/features/payments/services/deletePayment/deletePaymentService';

export async function deletePaymentAction(paymentId: string) {
  const result = await deletePaymentService(paymentId);
  return result;
}
