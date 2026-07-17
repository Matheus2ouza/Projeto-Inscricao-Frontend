'use server';

import { updateGuestInscriptionService } from '../../services/updateGuestInscription/updateGuestInscription';
import {
  UpdateGuestInscriptionInput,
  UpdateGuestInscriptionResponse,
} from '../../types/updateGuestInscription/updateGuestInscriptionTypes';

export type inputData = {
  id: string;
  locality: string;
  guestName: string;
  guestEmail: string;
  phone: string;
};

export async function updateGuestInscriptionAction(
  input: inputData,
): Promise<UpdateGuestInscriptionResponse> {
  const data: UpdateGuestInscriptionInput = {
    localityId: input.locality,
    name: input.guestName,
    email: input.guestEmail,
    phone: input.phone,
  };

  const result = await updateGuestInscriptionService(input.id, data);
  return result;
}
