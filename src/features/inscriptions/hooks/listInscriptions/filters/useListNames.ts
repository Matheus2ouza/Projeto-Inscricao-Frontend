import type {
  ListNamesParam,
  ListNamesResult,
} from '@/features/inscriptions/types/listInscriptions/filters/list-names/listNamesTypes';
import { useListNamesQuery } from './useListNamesQuery';

export function useListNames({ eventId }: ListNamesParam): ListNamesResult {
  const { data, isLoading, error, refetch } = useListNamesQuery(eventId);

  return {
    listNames: data || [],
    loading: isLoading,
    error: error || null,
    refresh: () => {
      void refetch();
    },
  };
}
