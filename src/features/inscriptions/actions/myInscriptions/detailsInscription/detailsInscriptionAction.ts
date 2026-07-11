'use server';

import { detailsInscriptionService } from '@/features/inscriptions/services/myInscriptions/detailsInscription/detailsInscriptionService';
import { DetailsInscriptionResponse } from '@/features/inscriptions/types/myInscriptions/detailsInscription/detailsInscriptionTypes';

/**
 * Action: Busca os detalhes de uma inscrição específica
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function detailsInscriptionAction(
  inscriptionId: string,
): Promise<DetailsInscriptionResponse> {
  const result = await detailsInscriptionService(inscriptionId);
  return result;
}
