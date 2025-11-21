"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import AdminManagerHomeDashboard from "@/features/home/components/admin/AdminManagerHomeDashboard";
import { useAdminDashboard } from "@/features/home/hook/admin/useAdminDashboard";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useCurrentUser } from "@/shared/context/user-context";
import { useUserRole } from "@/shared/hooks/useUserRole";
import { RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminManagerHome() {
  const router = useRouter();
  const { setLoading } = useGlobalLoading();
  const { loading } = useUserRole();
  const { user } = useCurrentUser();
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());
  const [relativeTime, setRelativeTime] = useState("há instantes");
  const dashboard = useAdminDashboard();
  const [refreshingAll, setRefreshingAll] = useState(false);

  const refreshDashboard = async () => {
    setRefreshingAll(true);
    await dashboard.refetchAll();
    setLastUpdated(new Date());
    router.refresh();
    setRefreshingAll(false);
  };

  useEffect(() => {
    const updateRelativeTime = () => {
      const diffMs = Date.now() - lastUpdated.getTime();
      const minutes = Math.floor(diffMs / 60000);

      if (minutes <= 0) {
        setRelativeTime("há instantes");
      } else if (minutes === 1) {
        setRelativeTime("há 1min");
      } else {
        setRelativeTime(`há ${minutes}min`);
      }
    };

    updateRelativeTime();
    const intervalId = setInterval(updateRelativeTime, 60_000);
    return () => clearInterval(intervalId);
  }, [lastUpdated]);

  useEffect(() => {
    setLoading(loading);
    return () => setLoading(false);
  }, [loading, setLoading]);

  return (
    <PageContainer
      title={user?.username ? `Olá, ${user.username}` : "Bem-vindo!"}
      description="Gerencie suas inscrições e acompanhe os eventos disponíveis."
      showBackButton={false}
      maxWidth="2xl"
      actions={
        <button
          type="button"
          onClick={refreshDashboard}
          disabled={refreshingAll || dashboard.loading || dashboard.isFetching}
          className="group inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[#0C3DAD] transition-colors hover:bg-[#0C3DAD] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C3DAD]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:text-[#9CC3FF] dark:hover:bg-[#0C3DAD] dark:hover:text-white dark:focus-visible:ring-white/40"
        >
          <RotateCw
            className={`h-4 w-4 text-[#0C3DAD] transition-colors group-hover:text-white dark:text-[#9CC3FF] ${
              refreshingAll || dashboard.isFetching ? "animate-spin" : ""
            }`}
          />
          <span>Atualizado {relativeTime}</span>
        </button>
      }
    >
      <AdminManagerHomeDashboard
        data={dashboard.data}
        loading={dashboard.loading}
        isFetching={dashboard.isFetching}
        refreshingMetric={dashboard.refreshingMetric}
        onRefreshMetric={dashboard.refreshMetric}
      />
    </PageContainer>
  );
}
