import { listPaymentPedingService } from '@/features/payments/services/listPaymentsPeding/listPaymentPedingService';
import { ListPaymentsPedingResponse } from '@/features/payments/types/listPaymentsPeding/listPaymentsPedingTypes';

export async function listPaymentsPedingAction(
  eventId: string,
  page: number,
  pageSize: number,
): Promise<ListPaymentsPedingResponse> {
  const result = await listPaymentPedingService(eventId, page, pageSize);
  return result;
}
