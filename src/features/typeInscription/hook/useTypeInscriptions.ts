import {
  useTypeInscriptionParams,
  useTypeInscriptionResult,
} from '../types/typesInscriptionsTypes';
import { useTypeInscriptionsQuery } from './useTypeInscriptionsQuery';

export function useTypeInscriptions({
  eventId,
}: useTypeInscriptionParams): useTypeInscriptionResult {
  const {
    data,
    isLoading: loading,
    isFetching: fetching,
    isFetched: fetched,
    error,
    refetch,
  } = useTypeInscriptionsQuery(eventId);

  return {
    typeInscriptions: data || [],
    loading,
    fetching,
    fetched,
    error,
    refresh: async () => await refetch(),
  };
}
