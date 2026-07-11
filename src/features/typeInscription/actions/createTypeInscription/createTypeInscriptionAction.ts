'use server';

import { createTypeInscriptionService } from '@/features/typeInscription/services/createTypeInscription/createTypeInscriptionService';
import type {
  CreateTypeInscriptionInput,
  CreateTypeInscriptionResponse,
} from '@/features/typeInscription/types/createTypeInscription/createTypeInscriptionTypes';

/**
 * Action: Cria um novo tipo de inscrição
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function createTypeInscriptionAction(
  input: CreateTypeInscriptionInput,
): Promise<CreateTypeInscriptionResponse> {
  const data = await createTypeInscriptionService(input);
  return data;
}
