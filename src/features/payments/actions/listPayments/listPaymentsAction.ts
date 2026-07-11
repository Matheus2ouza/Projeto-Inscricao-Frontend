'use server';

import { listPaymentsService } from '@/features/payments/services/listPayments/listPaymentsService';

export async function listPaymentsAction(
  eventId: string,
  page: number,
  pageSize: number,
) {
  const result = await listPaymentsService(eventId, page, pageSize);
  return result;
}
