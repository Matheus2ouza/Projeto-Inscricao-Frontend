'use client';

import EventManagement from '@/features/events/components/manager/EventManagement';
import { useEventManager } from '@/features/events/hooks/manager/useEventManager';
import { useTypeInscriptionsActions } from '@/features/typeInscription/hook/useTypeInscriptionsActions';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function EventManagementAdminPage() {
  const router = useRouter();
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const {
    event,
    loadingEvent,
    errorEvent,
    refetchEvent,
    typeInscriptions,
    loadingTypeInscriptions,
    refetchTypeInscriptions,
  } = useEventManager({ eventId });

  const {
    handleCreateTypeInscription,
    isCreatingTypeInscription,
    handleUpdateTypeInscription,
    isUpdatingTypeInscription,
    handleDeleteTypeInscription,
    isDeletingTypeInscription,
    handleDisableTypeInscription,
    isDisablingTypeInscription,
  } = useTypeInscriptionsActions(eventId);

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
    if (loadingEvent || loadingTypeInscriptions) {
      return renderSkeletonGrid();
    }
    if (errorEvent) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-gray-900 dark:text-white">
              {'Erro ao carregar evento'}
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/admin/events/manager">Voltar</Link>
              </Button>
              <Button
                onClick={() => {
                  refetchEvent();
                  refetchTypeInscriptions();
                }}
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <EventManagement
        event={event}
        typeInscriptions={typeInscriptions}
        refreshEvent={refetchEvent}
        refreshTypeInscriptions={refetchTypeInscriptions}
        onCreateTypeInscription={handleCreateTypeInscription}
        isCreatingTypeInscription={isCreatingTypeInscription}
        onUpdateTypeInscription={handleUpdateTypeInscription}
        isUpdatingTypeInscription={isUpdatingTypeInscription}
        onDeleteTypeInscription={handleDeleteTypeInscription}
        isDeletingTypeInscription={isDeletingTypeInscription}
        onDisableTypeInscription={handleDisableTypeInscription}
        isDisablingTypeInscription={isDisablingTypeInscription}
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
