'use client';

import EventManagement from '@/features/events/components/manager/EventManagement';
import { useEventDetailsManager } from '@/features/events/hooks/manager/eventDetailsManager/useEventDetailsManager';
import { useListTypeInscriptionsToManager } from '@/features/typeInscription/hook/listTypeInscriptionsToManager/useListTypeInscriptionsToManager';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function EventManagementSuperPage() {
  const router = useRouter();
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  // hook que busca os dados do evento
  const {
    event,
    loading: eventLoading,
    error: eventError,
    refresh: refreshEvent,
  } = useEventDetailsManager({ eventId });

  // hook que busca os dados do tipos de inscrição
  const {
    typeInscriptions,
    loading: typeInscriptionsLoading,
    error: typeInscriptionsError,
    refresh: refreshTypeInscriptions,
  } = useListTypeInscriptionsToManager({ eventId });

  const loading = eventLoading || typeInscriptionsLoading;
  const error = eventError || typeInscriptionsError || null;

  const refresh = () => {
    refreshEvent();
    refreshTypeInscriptions();
  };

  const handleBack = () => {
    router.replace(`/admin/events/manager`);
  };

  const renderSkeletonGrid = () => {
    return (
      <div className="bg-background min-h-screen rounded-sm">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10" />
              <div>
                <Skeleton className="mb-2 h-9 w-48" />
                <Skeleton className="h-5 w-64" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-80 rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-96 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    // Verifica se está carregando
    if (loading) {
      return renderSkeletonGrid();
    }

    // Verifica se houve erro
    if (error) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-gray-900 dark:text-white">
              {error.message || 'Erro ao carregar dados'}
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/admin/events/manager">Voltar</Link>
              </Button>
              <Button onClick={refresh}>Tentar Novamente</Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <EventManagement
        event={event}
        typeInscriptions={typeInscriptions}
        refreshEvent={refresh}
        refreshTypeInscriptions={refresh}
      />
    );
  };

  return (
    <PageContainer
      title="Gerenciar Evento"
      description="Edite e visualize os detalhes do evento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
