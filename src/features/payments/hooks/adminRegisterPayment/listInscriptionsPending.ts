import {
  ListInscriptionsPendingParams,
  UseListInscriptionsPendingResult,
} from '../../types/adminRegisterPayment/adminRegisterPaymentTypes';
import { useListInscriptionsPendingQuery } from './listInscriptionsPendingQuery';

export function useListInscriptionsPending({
  eventId,
}: ListInscriptionsPendingParams): UseListInscriptionsPendingResult {
  const { data, isLoading, isFetched, isFetching, error, refetch } =
    useListInscriptionsPendingQuery(eventId);

  return {
    inscriptions: data || null,
    loading: isLoading,
    fetching: isFetching,
    fetched: isFetched,
    error,
    refresh: async () => {
      await refetch();
    },
  };
}
