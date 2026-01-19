"use client";

import DetailsEvent from "@/features/events/components/DetailsEvent";
import { useDetailsEvent } from "@/features/events/hooks/useDetailsEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

export default function EventsDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const { event, loading, error } = useDetailsEvent(eventId);

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-8">
        <Skeleton className="h-80 w-full rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-56 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <div className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-md p-10 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Erro ao carregar evento
          </h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      );
    }

    return (
      <DetailsEvent
        event={event}
        individualInscriptionClick={handleIndividualInscription}
        groupInscriptionClick={handleGroupInscription}
      />
    );
  };

  const handleIndividualInscription = () => {
    router.push(`/user/individual-inscription/${eventId}`);
  };

  const handleGroupInscription = () => {
    router.push(`/user/group-inscription/${eventId}`);
  };

  return (
    <PageContainer
      title="Detalhes do Evento"
      description="Veja as informações completas antes de realizar sua inscrição"
    >
      {renderContent()}
    </PageContainer>
  );
}
