'use server';

import { updateParticipantFieldsConfigService } from '@/features/events/services/manager/updateParticipantFieldsConfig/updateParticipantFieldsConfig';
import { ParticipantFieldsConfig } from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';

export async function updateParticipantFieldsConfigAction(
  eventId: string,
  participanteConfig: ParticipantFieldsConfig,
) {
  const result = await updateParticipantFieldsConfigService(
    eventId,
    participanteConfig,
  );
  return result;
}
