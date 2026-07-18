'use server';

import { eventDetailsToGuestInscriptionService } from '../../services/guestInscripton/eventDetailsToGuestInscription';
import { EventDetailsToGuestInscriptionResponse } from '../../types/guestInscription/eventDetailsToGuestInscriptionTypes';

export async function eventDetailsToGuestInscriptionAction(
  eventId?: string,
): Promise<EventDetailsToGuestInscriptionResponse> {
  const result = await eventDetailsToGuestInscriptionService(eventId);
  return result;
}
