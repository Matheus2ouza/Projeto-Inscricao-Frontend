'use server';

import { listTypeInscriptionsToManagerService } from '@/features/typeInscription/services/listTypeInscriptionsToManager/listTypeInscriptionsToManagerService';
import type { ListTypeInscriptionsToManagerResponse } from '@/features/typeInscription/types/listTypeInscriptionsToManager/listTypeInscriptionsManagerTypes';

export async function listTypeInscriptionsToManagerAction(
  eventId?: string,
): Promise<ListTypeInscriptionsToManagerResponse> {
  const data = await listTypeInscriptionsToManagerService(eventId);
  return data;
}
