import {
  UseDetailsInscriptionParams,
  UseDetailsInscriptionResult,
} from '@/features/guest/types/detailsInscription/detailsInscriptionType';
import { useDetailsInscriptionQuery } from './useDetailsInscriptionQuery';

export function useDetailsInscription({
  confirmationCode,
}: UseDetailsInscriptionParams): UseDetailsInscriptionResult {
  const { data, isLoading, error, refetch } =
    useDetailsInscriptionQuery(confirmationCode);

  return {
    inscription: data || null,
    participant: data?.participant || null,
    payments: data?.payments || [],
    loading: isLoading,
    error: error?.message || null,
    refetch: async () => {
      await refetch();
    },
  };
}
