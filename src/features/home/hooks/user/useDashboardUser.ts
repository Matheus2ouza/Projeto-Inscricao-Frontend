'use client';

import {
  getDashboardUserActiveEventsAction,
  getDashboardUserTotalDebtAction,
  getDashboardUserTotalInscriptionsAction,
} from '@/features/home/actions/user/dashboardUserActions';
import type { GetDashboardUserResponse } from '@/features/home/types/user/dashboardUserTypes';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  useDashboardUserQuery,
  useInvalidateDashboardUserQuery,
} from './useDashboardUserQuery';

export type DashboardUserMetric = 'events' | 'inscriptions' | 'payments';

interface UseDashboardUserResult {
  data: GetDashboardUserResponse | undefined;
  loading: boolean;
  isFetching: boolean;
  error: Error | null;
  refreshingMetric: DashboardUserMetric | null;
  refreshMetric: (metric: DashboardUserMetric) => Promise<void>;
  refetchAll: () => Promise<void>;
}

export function useDashboardUser(): UseDashboardUserResult {
  const { data, isLoading, isFetching, error, refetch } =
    useDashboardUserQuery();
  const { updateMetric } = useInvalidateDashboardUserQuery();
  const [refreshingMetric, setRefreshingMetric] =
    useState<DashboardUserMetric | null>(null);

  const refreshMetric = useCallback(
    async (metric: DashboardUserMetric) => {
      setRefreshingMetric(metric);
      try {
        let value:
          | GetDashboardUserResponse[keyof GetDashboardUserResponse]
          | null = null;

        switch (metric) {
          case 'events':
            value = await getDashboardUserActiveEventsAction();
            break;
          case 'inscriptions':
            value = await getDashboardUserTotalInscriptionsAction();
            break;
          case 'payments':
            value = await getDashboardUserTotalDebtAction();
            break;
          default:
            break;
        }

        if (value !== null) {
          updateMetric(metric, value);
        }
      } catch (error) {
        const message = (error as Error | null)?.message ?? 'Erro inesperado';
        toast.error('Não foi possível atualizar este card', {
          description: message,
        });
      } finally {
        setRefreshingMetric(null);
      }
    },
    [updateMetric],
  );

  const refetchAll = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return useMemo(
    () => ({
      data,
      loading: isLoading,
      isFetching,
      error,
      refreshingMetric,
      refreshMetric,
      refetchAll,
    }),
    [
      data,
      isLoading,
      isFetching,
      error,
      refreshingMetric,
      refreshMetric,
      refetchAll,
    ],
  );
}
