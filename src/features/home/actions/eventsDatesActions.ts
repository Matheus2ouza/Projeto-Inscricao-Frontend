'use server';

import { eventsDatesService } from '@/features/home/services/admin/eventsDatesServices';
import type { FindEventDateResponse } from '@/features/home/types/eventsDatesTypes';

export async function eventsDatesAction(): Promise<FindEventDateResponse> {
  const data = await eventsDatesService();

  return data;
}
