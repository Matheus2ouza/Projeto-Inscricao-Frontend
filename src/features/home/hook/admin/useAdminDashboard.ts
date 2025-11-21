"use client";

import {
  getDashboardActiveEvents,
  getDashboardActiveParticipants,
  getDashboardAdmin,
  getDashboardTotalCollected,
  getDashboardTotalDebt,
  type DashboardAdminResponse,
} from "@/features/home/api/admin/dashboard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export type DashboardMetric = keyof DashboardAdminResponse;

export const dashboardAdminKeys = {
  all: ["dashboard-admin"] as const,
  summary: () => [...dashboardAdminKeys.all, "summary"] as const,
};

export function useAdminDashboard() {
  const queryClient = useQueryClient();
  const [refreshingMetric, setRefreshingMetric] = useState<
    DashboardMetric | null
  >(null);

  const summaryQuery = useQuery({
    queryKey: dashboardAdminKeys.summary(),
    queryFn: getDashboardAdmin,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });

  const refreshMetric = useCallback(
    async (metric: DashboardMetric) => {
      setRefreshingMetric(metric);
      try {
        let value = 0;
        switch (metric) {
          case "activeEvents":
            value = await getDashboardActiveEvents();
            break;
          case "totalCollected":
            value = await getDashboardTotalCollected();
            break;
          case "totalDebt":
            value = await getDashboardTotalDebt();
            break;
          case "activeParticipants":
            value = await getDashboardActiveParticipants();
            break;
          default:
            break;
        }

        queryClient.setQueryData<DashboardAdminResponse | undefined>(
          dashboardAdminKeys.summary(),
          (old) => ({
            activeEvents: old?.activeEvents ?? 0,
            totalCollected: old?.totalCollected ?? 0,
            totalDebt: old?.totalDebt ?? 0,
            activeParticipants: old?.activeParticipants ?? 0,
            [metric]: value,
          })
        );
      } catch (error) {
        const message = (error as Error | null)?.message ?? "Erro inesperado";
        toast.error("Não foi possível atualizar este card", {
          description: message,
        });
      } finally {
        setRefreshingMetric(null);
      }
    },
    [queryClient]
  );

  const refetchAll = useCallback(async () => {
    await summaryQuery.refetch();
  }, [summaryQuery]);

  const value = useMemo(
    () => ({
      data: summaryQuery.data,
      loading: summaryQuery.isLoading,
      isFetching: summaryQuery.isFetching,
      error: summaryQuery.error,
      refreshingMetric,
      refreshMetric,
      refetchAll,
    }),
    [
      summaryQuery.data,
      summaryQuery.isLoading,
      summaryQuery.isFetching,
      summaryQuery.error,
      refreshingMetric,
      refreshMetric,
      refetchAll,
    ]
  );

  return value;
}
