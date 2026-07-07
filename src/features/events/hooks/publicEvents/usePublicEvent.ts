import {
  UsePublicEventParams,
  UsePublicEventResult,
} from '../../types/publicEvents/publicEventsTypes';
import { usePublicEventQuery } from './usePublicEventQuery';

export function usePublicEvent({
  slug,
}: UsePublicEventParams): UsePublicEventResult {
  const { data, isLoading, error, refetch } = usePublicEventQuery(slug);

  return {
    event: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch: async () => {
      await refetch();
    },
  };
}
