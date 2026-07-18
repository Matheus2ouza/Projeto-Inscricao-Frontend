'use server';

import { updateInscriptionModeService } from '@/features/events/services/manager/updateInscriptionMode/updateInscriptionModeService';
import { InscriptionMode } from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';

export async function updateInscriptionModeAction(
  eventId: string,
  inscriptionMode: InscriptionMode[],
) {
  const result = await updateInscriptionModeService(eventId, inscriptionMode);
  return result;
}
