import { useListRegionsQuery } from '@/features/regions/hooks/listRegions/useListRegionsQuery';
import { UseListRegionsResult } from '@/features/regions/types/listRegions/listRegionsTypes';
import { useEffect } from 'react';

export function useListRegions(
  autoFetch: boolean = true,
): UseListRegionsResult {
  const { data, isLoading, error, refetch } = useListRegionsQuery();

  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [autoFetch, refetch]);

  return {
    regions: data || [],
    loading: isLoading,
    error: error,
    refetch: async () => {
      await refetch();
    },
  };
}
