'use server';

import { registerGroupInscriptionService } from '@/features/inscriptions/services/groupInscription/registerGroupInscriptionService';
import {
  GroupInscriptionResponse,
  GroupInscriptionSubmit,
} from '@/features/inscriptions/types/groupInscription/registerGroupInscriptionTypes';

/**
 * Action: Realiza inscrição em grupo
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function registerGroupInscriptionAction(
  data: GroupInscriptionSubmit,
): Promise<GroupInscriptionResponse> {
  const result = await registerGroupInscriptionService(data);
  return result;
}
