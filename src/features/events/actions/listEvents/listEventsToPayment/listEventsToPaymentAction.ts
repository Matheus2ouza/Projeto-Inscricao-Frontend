'use server';

import { ListEventsToPaymentService } from '@/features/events/services/listEvents/listEventsToPayment/listEventsToPaymentService';
import type {
  ListEventsToPaymentParams,
  ListEventsToPaymentResponse,
} from '@/features/events/types/listEvents/listEventsToPayment/listEventsToPaymentTypes';

export async function ListEventsToPaymentAction(
  params: ListEventsToPaymentParams,
): Promise<ListEventsToPaymentResponse> {
  const result = await ListEventsToPaymentService(params);
  return result;
}
