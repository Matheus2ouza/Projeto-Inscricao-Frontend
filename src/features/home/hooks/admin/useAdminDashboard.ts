'use client';

import {
  getDashboardActiveParticipantsAction,
  getDashboardCollectedTotalsAction,
  getDashboardTotalDebtAction,
  getDashboardTotalExpenseAction,
} from '@/features/home/actions/admin/dashboardActions';
import type {
  DashboardAdminResponse,
  DashboardMetric,
} from '@/features/home/types/admin/dashboardTypes';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  useDashboardAdminQuery,
  useInvalidateDashboardAdminQuery,
} from './useDashboardAdminQuery';

interface UseDashboardAdminParams {
  eventId?: string;
}

interface UseDashboardAdminResult {
  data: DashboardAdminResponse | undefined;
  loading: boolean;
  isFetching: boolean;
  error: Error | null;
  refreshingMetric: DashboardMetric | null;
  refreshMetric: (metric: DashboardMetric) => Promise<void>;
  refetchAll: () => Promise<void>;
}

export function useDashboardAdmin({
  eventId,
}: UseDashboardAdminParams): UseDashboardAdminResult {
  const { data, isLoading, isFetching, error, refetch } =
    useDashboardAdminQuery(eventId);
  const { updateMetric, updateCollectedMetrics } =
    useInvalidateDashboardAdminQuery();
  const [refreshingMetric, setRefreshingMetric] =
    useState<DashboardMetric | null>(null);

  const refreshMetric = useCallback(
    async (metric: DashboardMetric) => {
      setRefreshingMetric(metric);
      try {
        // Métricas que vêm da mesma API (totais de coletas)
        if (
          metric === 'totalCollected' ||
          metric === 'totalNetValueCollected'
        ) {
          const totals = await getDashboardCollectedTotalsAction(eventId); // ← Chama ACTION
          updateCollectedMetrics(
            eventId,
            totals.totalCollected,
            totals.totalNetValueCollected,
          );
          return;
        }

        // Métricas individuais
        let value = 0;
        switch (metric) {
          case 'totalExpense':
            value = await getDashboardTotalExpenseAction(eventId); // ← Chama ACTION
            break;
          case 'totalDebt':
            value = await getDashboardTotalDebtAction(eventId); // ← Chama ACTION
            break;
          case 'activeParticipants':
            value = await getDashboardActiveParticipantsAction(eventId); // ← Chama ACTION
            break;
          default:
            break;
        }

        updateMetric(eventId, metric, value);
      } catch (error) {
        const message = (error as Error | null)?.message ?? 'Erro inesperado';
        toast.error('Não foi possível atualizar este card', {
          description: message,
        });
      } finally {
        setRefreshingMetric(null);
      }
    },
    [eventId, updateMetric, updateCollectedMetrics],
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
