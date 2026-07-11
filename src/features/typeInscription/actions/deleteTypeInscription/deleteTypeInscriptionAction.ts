'use server';

import { deleteTypeInscriptionService } from '@/features/typeInscription/services/deleteTypeInscription/deleteTypeInscriptionService';
import {
  DeleteTypeInscriptionInput,
  DeleteTypeInscriptionResponse,
} from '@/features/typeInscription/types/deleteTypeInscription/deleteTypeInscriptionTypes';

/**
 * Action: Deleta um tipo de inscrição
 * Passa os dados adiante sem normalização
 */
export async function deleteTypeInscriptionAction({
  id,
}: DeleteTypeInscriptionInput): Promise<DeleteTypeInscriptionResponse> {
  await deleteTypeInscriptionService({ id });
}
