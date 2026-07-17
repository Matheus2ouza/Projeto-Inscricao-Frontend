import {
  RegisterGuestInscriptionInput,
  RegisterGuestInscriptionResponse,
} from '@/features/guest/types/guestInscription/registerGuesInscriptionTypes';
import { registerGuestInscriptionService } from '../../services/registerGuestInscription/registerGuestInscription';

export async function registerGuestInscriptionAction(
  eventId: string,
  input: RegisterGuestInscriptionInput,
): Promise<RegisterGuestInscriptionResponse> {
  const result = await registerGuestInscriptionService(eventId, input);
  return result;
}
