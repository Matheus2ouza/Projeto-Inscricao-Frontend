import {
  DetailsInscriptionParams,
  DetailsInscriptionResult,
} from '@/features/inscriptions/types/listInscriptions/inscription/detailsInscriptionTypes';
import { useDetailsInscriptionQuery } from './useDetailsInscriptionQuery';

export function useDetailsInscription({
  inscriptionId,
}: DetailsInscriptionParams): DetailsInscriptionResult {
  const { data, isLoading, error, refetch } =
    useDetailsInscriptionQuery(inscriptionId);

  return {
    inscription: data?.inscription || null,
    participants: data?.participants || [],
    payments: data?.payments || [],
    paymentLink: data?.paymentLink || null,
    loading: isLoading,
    error,
    refetch: async () => {
      await refetch();
    },
  };
}
