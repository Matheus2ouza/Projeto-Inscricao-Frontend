'use server';

import { listPaymentsService } from '@/features/payments/services/listPayments/listPaymentsService';

export async function listPaymentsAction(
  page: number,
  pageSize: number,
  eventId?: string,
  localityId?: string,
) {
  const result = await listPaymentsService(page, pageSize, eventId, localityId);
  return result;
}
