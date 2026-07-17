'use server';

import { updateGuestParticipantService } from '@/features/guest/services/updateGuestParticipant/updateGuestParticipant';
import {
  UpdateGuestParticipantInput,
  UpdateGuestParticipantResponse,
} from '@/features/guest/types/updateGuestParticipant/updateGuestParticipantTypes';

export async function updateGuestParticipantAction(
  id: string,
  input: UpdateGuestParticipantInput,
): Promise<UpdateGuestParticipantResponse> {
  const result = await updateGuestParticipantService(id, input);
  return result;
}
