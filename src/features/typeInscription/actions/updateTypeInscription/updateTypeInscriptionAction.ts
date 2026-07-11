'use server';

import { updateTypeInscriptionService } from '@/features/typeInscription/services/updateTypeInscription/updateTypeInscriptionService';
import type {
  UpdateTypeInscriptionInput,
  UpdateTypeInscriptionResponse,
} from '@/features/typeInscription/types/updateTypeInscription/updateTypeInscriptionTypes';

/**
 * Action: Atualiza um tipo de inscrição
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function updateTypeInscriptionAction(
  typeInscriptionId: string,
  input: UpdateTypeInscriptionInput,
): Promise<UpdateTypeInscriptionResponse> {
  const data = await updateTypeInscriptionService(typeInscriptionId, input);
  return data;
}
