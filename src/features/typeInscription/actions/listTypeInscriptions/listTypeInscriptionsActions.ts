'use server';

import { listTypeInscriptionsService } from '@/features/typeInscription/services/listTypeInscriptions/listTypeInscriptionsService';
import type { ListTypeInscriptionsResponse } from '@/features/typeInscription/types/listTypeInscriptions/listTypeInscriptionsTypes';

export async function listTypeInscriptionsAction(
  eventId: string,
): Promise<ListTypeInscriptionsResponse> {
  const data = await listTypeInscriptionsService(eventId);
  return data;
}
