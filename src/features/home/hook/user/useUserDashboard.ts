"use client";

import {
  getDashboardUser,
  getDashboardUserActiveEvents,
  getDashboardUserTotalDebt,
  getDashboardUserTotalInscriptions,
  type GetDashboardUserResponse,
} from "@/features/home/api/user/dashboard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

type Summary = GetDashboardUserResponse;

export type DashboardUserMetric = "events" | "inscriptions" | "payments";

export const dashboardUserKeys = {
  all: ["dashboard-user"] as const,
  summary: () => [...dashboardUserKeys.all, "summary"] as const,
};

const defaultSummary: Summary = {
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

export function useUserDashboard() {
  const queryClient = useQueryClient();
  const [refreshingMetric, setRefreshingMetric] = useState<DashboardUserMetric | null>(null);

  const summaryQuery = useQuery({
    queryKey: dashboardUserKeys.summary(),
    queryFn: getDashboardUser,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });

  const refreshMetric = useCallback(
    async (metric: DashboardUserMetric) => {
      setRefreshingMetric(metric);
      try {
        if (metric === "events") {
          const events = await getDashboardUserActiveEvents();
          queryClient.setQueryData<Summary | undefined>(
            dashboardUserKeys.summary(),
            (old) => {
              const current = old ?? defaultSummary;
              return { ...current, events };
            }
          );
        }

        if (metric === "inscriptions") {
          const inscriptions = await getDashboardUserTotalInscriptions();
          queryClient.setQueryData<Summary | undefined>(
            dashboardUserKeys.summary(),
            (old) => {
              const current = old ?? defaultSummary;
              return { ...current, inscriptions };
            }
          );
        }

        if (metric === "payments") {
          const payments = await getDashboardUserTotalDebt();
          queryClient.setQueryData<Summary | undefined>(
            dashboardUserKeys.summary(),
            (old) => {
              const current = old ?? defaultSummary;
              return { ...current, payments };
            }
          );
        }
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
