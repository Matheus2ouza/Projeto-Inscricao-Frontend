'use server';

import { guestInscriptionDetailsService } from '@/features/guest/services/guestInscriptionDetails/guestInscriptionDetails';
import { GuestInscriptionDetailsResponse } from '@/features/guest/types/detailsInscription/detailsInscriptionType';

export async function guestInscriptionDetailsAction(
  confirmationCode?: string,
): Promise<GuestInscriptionDetailsResponse> {
  const result = await guestInscriptionDetailsService(confirmationCode);
  return result;
}
