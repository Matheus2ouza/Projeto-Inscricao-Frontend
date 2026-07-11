'use client';

import { getDashboardUserAction } from '@/features/home/actions/user/dashboardUserActions';
import type { GetDashboardUserResponse } from '@/features/home/types/user/dashboardUserTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const dashboardUserKeys = {
  all: ['dashboard-user'] as const,
  summary: () => [...dashboardUserKeys.all, 'summary'] as const,
};

export const defaultSummary: GetDashboardUserResponse = {
  inscriptions: {
    countTotalInscriptions: 0,
    countTotalParticipants: 0,
    countPendingInscriptions: 0,
  },
  events: {
    activeEvents: 0,
  },
  payments: {
    countTotalDebt: 0,
    countTotalPaid: 0,
    debtCompletionPercentage: 0,
  },
};

export function useDashboardUserQuery() {
  return useQuery({
    queryKey: dashboardUserKeys.summary(),
    queryFn: () => getDashboardUserAction(),
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });
}

export function useInvalidateDashboardUserQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: dashboardUserKeys.all,
      });
    },

    invalidateSummary: () => {
      queryClient.invalidateQueries({
        queryKey: dashboardUserKeys.summary(),
      });
    },

    removeAll: () => {
      queryClient.removeQueries({
        queryKey: dashboardUserKeys.all,
      });
    },

    removeSummary: () => {
      queryClient.removeQueries({
        queryKey: dashboardUserKeys.summary(),
      });
    },

    setSummaryData: (data: GetDashboardUserResponse) => {
      queryClient.setQueryData(dashboardUserKeys.summary(), data);
    },

    updateMetric: (
      metric: keyof GetDashboardUserResponse,
      value: GetDashboardUserResponse[keyof GetDashboardUserResponse],
    ) => {
      queryClient.setQueryData<GetDashboardUserResponse | undefined>(
        dashboardUserKeys.summary(),
        (old) => {
          const current = old ?? defaultSummary;
          return { ...current, [metric]: value };
        },
      );
    },
  };
}
