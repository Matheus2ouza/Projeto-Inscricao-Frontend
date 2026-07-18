'use server';

import { registerGroupInscriptionService } from '@/features/inscriptions/services/groupInscription/registerGroupInscriptionService';
import {
  GroupInscriptionActionResult,
  GroupInscriptionSubmit,
} from '@/features/inscriptions/types/groupInscription/registerGroupInscriptionTypes';

/**
 * Action: Realiza inscrição em grupo
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function registerGroupInscriptionAction(
  data: GroupInscriptionSubmit,
): Promise<GroupInscriptionActionResult> {
  return registerGroupInscriptionService(data);
}
