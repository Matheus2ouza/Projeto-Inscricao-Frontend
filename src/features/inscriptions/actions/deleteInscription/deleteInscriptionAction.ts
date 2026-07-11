import { deleteInscriptionService } from '@/features/inscriptions/services/deleteInscription/deleteInscriptionService';

export async function deleteInscriptionAction(inscriptionId: string) {
  const result = await deleteInscriptionService(inscriptionId);
  return result;
}
