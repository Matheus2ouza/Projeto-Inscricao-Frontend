'use server';

import { registerIndividualInscriptionService } from '@/features/inscriptions/services/individualInscription/registerIndividualInscriptionService';
import {
  IndividualInscriptionInput,
  IndividualInscriptionResponse,
} from '@/features/inscriptions/types/individualInscription/registerIndividualInscriptionTypes';

/**
 * Action: Realiza inscrição individual
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function registerIndividualInscriptionAction(
  data: IndividualInscriptionInput,
): Promise<IndividualInscriptionResponse> {
  const result = await registerIndividualInscriptionService(data);
  return result;
}
