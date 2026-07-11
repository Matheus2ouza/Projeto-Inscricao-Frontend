'use client';

import DetailsEvent from '@/features/events/components/DetailsEvent';
import { useEventDetails } from '@/features/events/hooks/eventDetails/useEventDetails';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

export default function EventsDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;
  const { event, loading, error } = useEventDetails({ eventId });

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-8">
        <Skeleton className="h-80 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
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
        <div className="rounded-2xl border border-gray-200/80 bg-white/90 p-10 text-center backdrop-blur-md dark:border-white/10 dark:bg-white/5">
          <h2 className="mb-2 text-2xl font-semibold text-red-600">
            Erro ao carregar evento
          </h2>
          <p className="text-muted-foreground">{error.message}</p>
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
    router.push(`/user/inscription/individual-inscription/${eventId}`);
  };

  const handleGroupInscription = () => {
    router.push(`/user/inscription/group-inscription/${eventId}`);
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
