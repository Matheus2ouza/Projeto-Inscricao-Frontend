'use client';

import {
  Event,
  StatusEvent,
} from '@/features/events/types/combobox/comboboxEventTypes';
import { useCallback } from 'react';
import { useEventsComboboxQuery } from './useEventsComboboxQuery';

type UseEventsResult = {
  events: Event[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useEventsCombobox(
  status?: StatusEvent | StatusEvent[],
): UseEventsResult {
  const { data, isLoading, error, refetch } = useEventsComboboxQuery(status);

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    events: data ?? [],
    loading: isLoading,
    error: (error as Error | null)?.message ?? null,
    refetch: handleRefetch,
  };
}
