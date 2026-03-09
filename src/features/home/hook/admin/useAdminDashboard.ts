"use client";

import {
  getDashboardActiveParticipants,
  getDashboardAdmin,
  getDashboardCollectedTotals,
  getDashboardTotalDebt,
  getDashboardTotalExpense,
  type DashboardAdminResponse,
} from "@/features/home/api/admin/dashboard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export type DashboardMetric = keyof DashboardAdminResponse;

export const dashboardAdminKeys = {
  all: ["dashboard-admin"] as const,
  summary: (eventId?: string) =>
    [...dashboardAdminKeys.all, "summary", eventId ?? "all"] as const,
};

export function useAdminDashboard(eventId?: string) {
  const queryClient = useQueryClient();
  const [refreshingMetric, setRefreshingMetric] =
    useState<DashboardMetric | null>(null);

  const summaryQuery = useQuery({
    queryKey: dashboardAdminKeys.summary(eventId),
    queryFn: () => getDashboardAdmin(eventId),
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });

  const refreshMetric = useCallback(
    async (metric: DashboardMetric) => {
      setRefreshingMetric(metric);
      try {
        if (
          metric === "totalCollected" ||
          metric === "totalNetValueCollected"
        ) {
          const totals = await getDashboardCollectedTotals(eventId);
          queryClient.setQueryData<DashboardAdminResponse | undefined>(
            dashboardAdminKeys.summary(eventId),
            (old) => ({
              totalExpense: old?.totalExpense ?? 0,
              totalCollected: totals.totalCollected,
              totalNetValueCollected: totals.totalNetValueCollected,
              totalDebt: old?.totalDebt ?? 0,
              activeParticipants: old?.activeParticipants ?? 0,
            }),
          );
          return;
        }

        let value = 0;
        switch (metric) {
          case "totalExpense":
            value = await getDashboardTotalExpense(eventId);
            break;
          case "totalDebt":
            value = await getDashboardTotalDebt(eventId);
            break;
          case "activeParticipants":
            value = await getDashboardActiveParticipants(eventId);
            break;
          default:
            break;
        }

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
      } catch (error) {
        const message = (error as Error | null)?.message ?? "Erro inesperado";
        toast.error("Não foi possível atualizar este card", {
          description: message,
        });
      } finally {
        setRefreshingMetric(null);
      }
    },
    [eventId, queryClient],
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
    ],
  );

  return value;
}
