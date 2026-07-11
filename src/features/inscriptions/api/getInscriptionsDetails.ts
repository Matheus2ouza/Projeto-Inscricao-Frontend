import { axiosClient } from '@/lib/axios';
import { InscriptionDetails } from '../types/inscriptionsDetails.types';

export async function getInscriptionsDetails(
  inscriptionId: string,
): Promise<InscriptionDetails> {
  const { data } = await axiosClient.get<InscriptionDetails>(
    `/inscriptions/${inscriptionId}/details`,
  );
  return data;
}
