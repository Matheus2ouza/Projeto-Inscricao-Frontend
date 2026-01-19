"use client";

import EventManagement from "@/features/events/components/manager/EventManagement";
import { useEventManager } from "@/features/events/hooks/manager/useEventManager";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EventManagementAdminPage() {
  const router = useRouter();
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  if (!eventId) {
    return null;
  }
  const { event, isLoading, error, refetch } = useEventManager(eventId);

  const renderSkeletonGrid = () => {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10" />
              <div>
                <Skeleton className="h-9 w-48 mb-2" />
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
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
    if (isLoading) {
      return renderSkeletonGrid();
    }
    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-gray-900 dark:text-white">
              {"Erro ao carregar evento"}
            </p>
            <Button asChild>
              <Link href="/admin/events/manager">Voltar para Eventos</Link>
            </Button>
          </div>
        </div>
      );
    }

    if (!event) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">
            {"Evento não encontrado"}
          </p>
        </div>
      );
    }

    return <EventManagement event={event} refetch={refetch} />;
  };

  const handleBack = () => {
    router.replace(`/admin/events/manager`);
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
