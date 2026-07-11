'use server';

import { updateTypeInscriptionActiveService } from '@/features/typeInscription/services/updateTypeInscriptionActive/updateTypeInscriptionActiveService';
import type {
  UpdateTypeInscriptionActiveInput,
  UpdateTypeInscriptionActiveResponse,
} from '@/features/typeInscription/types/updateTypeInscriptionActive/updateTypeInscriptionActiveTypes';

/**
 * Action: Ativa/Desativa um tipo de inscrição
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function updateTypeInscriptionActiveAction({
  typeInscriptionId,
  active,
}: UpdateTypeInscriptionActiveInput): Promise<UpdateTypeInscriptionActiveResponse> {
  const data = await updateTypeInscriptionActiveService({
    typeInscriptionId,
    active,
  });
  return data;
}
