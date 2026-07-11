'use server';

import { updateInscriptionService } from '@/features/inscriptions/services/updateInscription/updateInscriptionService';
import { UpdateInscriptionInput } from '@/features/inscriptions/types/updateInscription/updateInscriptionTypes';

/**
 * Action: Atualiza os dados de uma inscrição específica
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function updateInscriptionAction(
  inscriptionId: string,
  update: UpdateInscriptionInput,
) {
  const result = await updateInscriptionService(inscriptionId, update);
  return result;
}
