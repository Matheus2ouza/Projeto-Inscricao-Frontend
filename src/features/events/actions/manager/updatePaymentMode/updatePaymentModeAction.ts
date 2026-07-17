'use server';

import { updatePaymentModeService } from '@/features/events/services/manager/updatePaymentMode/updatePaymentModeService';
import { PaymentMode } from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';

export async function updatePaymentModeAction(
  eventId: string,
  paymentMode: PaymentMode[],
) {
  const result = await updatePaymentModeService(eventId, paymentMode);
  return result;
}
