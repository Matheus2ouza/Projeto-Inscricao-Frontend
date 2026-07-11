'use server';

import { paymentsDatesService } from '@/features/home/services/admin/paymentsDatesService';
import type { FindPaymentsDateResponse } from '@/features/home/types/admin/paymentsDatesTypes';

export async function paymentsDatesAction(): Promise<FindPaymentsDateResponse> {
  const data = await paymentsDatesService();
  return data;
}
