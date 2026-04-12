import { UsePublicEventsResult } from '../../types/publicEvents/publicEventsTypes';
import { usePublicEventsQuery } from './usePublicEventsQuery';

export function usePublicEvents(): UsePublicEventsResult {
  const { data, isLoading, error, refetch } = usePublicEventsQuery();

  return {
    events: data || [],
    loading: isLoading,
    error: error?.message || null,
    refetch: async () => {
      await refetch();
    },
  };
}
