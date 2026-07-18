'use client';

import { listRegionsAction } from '@/features/regions/actions/listRegions/listRegions';
import { type RegionDto } from '@/features/regions/api/getRegions';
import { useEffect, useState } from 'react';

type UseRegionsResult = {
  regions: RegionDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useRegions(autoFetch: boolean = true): UseRegionsResult {
  const [regions, setRegions] = useState<RegionDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRegions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listRegionsAction();
      setRegions(data);
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : 'Falha ao carregar regiões';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchRegions();
    }
  }, [autoFetch]);

  return { regions, loading, error, refetch: fetchRegions };
}
