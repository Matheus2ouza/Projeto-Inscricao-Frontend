'use client';

import { useGlobalLoading } from '@/components/GlobalLoading';
import { ComboboxEvent } from '@/features/events/components/combobox/ComboBoxEvent';
import { StatusEvent } from '@/features/events/types/combobox/comboboxEventTypes';
import AdminManagerHomeDashboard from '@/features/home/components/admin/AdminManagerHomeDashboard';
import { useDashboardAdmin } from '@/features/home/hooks/admin/useAdminDashboard';
import { useInvalidateDashboardAdminQuery } from '@/features/home/hooks/admin/useDashboardAdminQuery';
import { DashboardAdminResponse } from '@/features/home/types/admin/dashboardTypes';
import PageContainer from '@/shared/components/layout/PageContainer';
import { useCurrentUser } from '@/shared/context/user-context';
import { RotateCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function AdminManagerHome() {
  const router = useRouter();
  const { setLoading } = useGlobalLoading();
  const { user } = useCurrentUser();
  const [selectedEventId, setSelectedEventId] = useState('');
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());
  const [relativeTime, setRelativeTime] = useState('há instantes');

  // Hooks de dashboard
  const dashboard = useDashboardAdmin({
    eventId: selectedEventId || undefined,
  });

  // Hook de invalidação
  const invalidateDashboard = useInvalidateDashboardAdminQuery();

  // Atualiza o tempo relativo
  useEffect(() => {
    const updateRelativeTime = () => {
      const diffMs = Date.now() - lastUpdated.getTime();
      const minutes = Math.floor(diffMs / 60000);

      if (minutes <= 0) {
        setRelativeTime('há instantes');
      } else if (minutes === 1) {
        setRelativeTime('há 1min');
      } else {
        setRelativeTime(`há ${minutes}min`);
      }
    };

    updateRelativeTime();
    const intervalId = setInterval(updateRelativeTime, 60_000);
    return () => clearInterval(intervalId);
  }, [lastUpdated]);

  // Atualiza timestamp quando os dados são carregados
  useEffect(() => {
    if (!dashboard.isFetching && !dashboard.loading) {
      setLastUpdated(new Date());
    }
  }, [dashboard.isFetching, dashboard.loading, selectedEventId]);

  // Refresh completo do dashboard
  const refreshDashboard = useCallback(async () => {
    if (refreshingAll || dashboard.isFetching) return;

    setRefreshingAll(true);
    try {
      // Invalida o cache e força refetch
      invalidateDashboard.invalidateSummary(selectedEventId || undefined);
      await dashboard.refetchAll();
      setLastUpdated(new Date());
      router.refresh();

      toast.success('Dashboard atualizado com sucesso!');
    } catch (error) {
      const message = (error as Error | null)?.message ?? 'Erro inesperado';
      toast.error('Erro ao atualizar dashboard', {
        description: message,
      });
    } finally {
      setRefreshingAll(false);
    }
  }, [
    refreshingAll,
    dashboard.isFetching,
    dashboard.refetchAll,
    invalidateDashboard,
    selectedEventId,
    router,
  ]);

  // Refresh apenas de métricas específicas
  const refreshMetric = useCallback(
    async (metric: keyof DashboardAdminResponse) => {
      await dashboard.refreshMetric(metric);
      setLastUpdated(new Date());
    },
    [dashboard],
  );

  const handleViewPayment = useCallback(
    (eventId: string, paymentId: string) => {
      router.push(`payments/list-payments/${eventId}/details/${paymentId}`);
    },
    [router],
  );

  // Memo para evitar re-renders desnecessários
  const pageActions = useMemo(
    () => (
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[220px]">
          <ComboboxEvent
            value={selectedEventId}
            onChange={setSelectedEventId}
            statuses={[
              StatusEvent.OPEN,
              StatusEvent.CLOSE,
              StatusEvent.FINALIZED,
            ]}
          />
        </div>
        <button
          type="button"
          onClick={refreshDashboard}
          disabled={refreshingAll || dashboard.isFetching}
          className="group focus-visible:ring-offset-background inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[#0C3DAD] transition-colors hover:bg-[#0C3DAD] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0C3DAD]/60 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-[#9CC3FF] dark:hover:bg-[#0C3DAD] dark:hover:text-white dark:focus-visible:ring-white/40"
        >
          <RotateCw
            className={`h-4 w-4 text-[#0C3DAD] transition-colors group-hover:text-white dark:text-[#9CC3FF] ${
              refreshingAll || dashboard.isFetching ? 'animate-spin' : ''
            }`}
          />
          <span>Atualizado {relativeTime}</span>
        </button>
      </div>
    ),
    [
      selectedEventId,
      refreshDashboard,
      refreshingAll,
      dashboard.isFetching,
      relativeTime,
    ],
  );

  return (
    <PageContainer
      title={user?.username ? `Olá, ${user.username}` : 'Bem-vindo!'}
      description="Gerencie suas inscrições e acompanhe os eventos disponíveis."
      showBackButton={false}
      maxWidth="2xl"
      actions={pageActions}
    >
      <AdminManagerHomeDashboard
        data={dashboard.data}
        loading={dashboard.loading}
        isFetching={dashboard.isFetching}
        refreshingMetric={dashboard.refreshingMetric}
        onRefreshMetric={refreshMetric}
        onViewPayment={handleViewPayment}
      />
    </PageContainer>
  );
}
