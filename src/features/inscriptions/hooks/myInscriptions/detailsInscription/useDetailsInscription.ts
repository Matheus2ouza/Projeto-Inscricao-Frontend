import {
  DetailsInscriptionsParams,
  UseMyInscriptionsResult,
} from '../../../types/myInscriptions/detailsInscription/detailsInscriptionTypes';
import { useDetailsInscriptionQuery } from './useDetailsInscriptionQuery';

export function useDetailsInscription({
  inscriptionId,
}: DetailsInscriptionsParams): UseMyInscriptionsResult {
  const {
    data,
    isLoading: loading,
    isFetching: fetching,
    isFetched: fetched,
    error,
    refetch,
  } = useDetailsInscriptionQuery(inscriptionId);

  return {
    inscription: data?.inscription || null,
    participants: data?.participants || [],
    payments: data?.payments || [],
    loading,
    fetching,
    fetched,
    error,
    refresh: async () => {
      await refetch();
    },
  };
}
