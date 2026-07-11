'use client';

import { getDashboardAdminAction } from '@/features/home/actions/admin/dashboardActions';
import type { DashboardAdminResponse } from '@/features/home/types/admin/dashboardTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const dashboardAdminKeys = {
  all: ['dashboard-admin'] as const,
  summary: (eventId?: string) =>
    [...dashboardAdminKeys.all, 'summary', eventId ?? 'all'] as const,
};

export function useDashboardAdminQuery(eventId?: string) {
  return useQuery({
    queryKey: dashboardAdminKeys.summary(eventId),
    queryFn: () => getDashboardAdminAction(eventId),
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });
}

export function useInvalidateDashboardAdminQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: dashboardAdminKeys.all,
      });
    },

    invalidateSummary: (eventId?: string) => {
      queryClient.invalidateQueries({
        queryKey: dashboardAdminKeys.summary(eventId),
      });
    },

    removeAll: () => {
      queryClient.removeQueries({
        queryKey: dashboardAdminKeys.all,
      });
    },

    removeSummary: (eventId?: string) => {
      queryClient.removeQueries({
        queryKey: dashboardAdminKeys.summary(eventId),
      });
    },

    setSummaryData: (
      eventId: string | undefined,
      data: DashboardAdminResponse,
    ) => {
      queryClient.setQueryData(dashboardAdminKeys.summary(eventId), data);
    },

    updateMetric: (
      eventId: string | undefined,
      metric: keyof DashboardAdminResponse,
      value: number,
    ) => {
      queryClient.setQueryData<DashboardAdminResponse | undefined>(
        dashboardAdminKeys.summary(eventId),
        (old) => ({
          totalExpense: old?.totalExpense ?? 0,
          totalCollected: old?.totalCollected ?? 0,
          totalNetValueCollected: old?.totalNetValueCollected ?? 0,
          totalDebt: old?.totalDebt ?? 0,
          activeParticipants: old?.activeParticipants ?? 0,
          [metric]: value,
        }),
      );
    },

    updateCollectedMetrics: (
      eventId: string | undefined,
      totalCollected: number,
      totalNetValueCollected: number,
    ) => {
      queryClient.setQueryData<DashboardAdminResponse | undefined>(
        dashboardAdminKeys.summary(eventId),
        (old) => ({
          totalExpense: old?.totalExpense ?? 0,
          totalCollected,
          totalNetValueCollected,
          totalDebt: old?.totalDebt ?? 0,
          activeParticipants: old?.activeParticipants ?? 0,
        }),
      );
    },
  };
}
