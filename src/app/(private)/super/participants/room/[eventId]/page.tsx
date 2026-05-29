'use client';

import RoomParticipantsManager from '@/features/participants/components/room/RoomParticipantsManager';
import { useParticipantsReports } from '@/features/participants/hooks/actions/useParticipantsReports';
import { useListNamesParticipants } from '@/features/participants/hooks/room/useListNamesParticipants';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card } from 'antd';
import { Users } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function ListGuestParticipantsSuperPage() {
  const router = useRouter();
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId =
    (Array.isArray(rawEventId) ? rawEventId[0] : rawEventId) ?? '';

  const { participants, loading, error, refresh } = useListNamesParticipants({
    eventId,
  });

  const {
    //pdf
    handleGeneratePdfRoomPdfReport,
    isGeneratePdfRoomMutation,
  } = useParticipantsReports();

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="w-full space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
              <Skeleton className="h-3 w-44" />
            </div>
          ))}
        </div>

        <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
          <div className="border-b p-4">
            <Skeleton className="h-6 w-56" />
          </div>
          <div className="space-y-3 p-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="ml-auto h-4 w-16" />
              </div>
            ))}
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
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <div>
            <p className="font-semibold text-red-600 dark:text-red-400">
              Não foi possível carregar os participantes.
            </p>
            <p className="text-muted-foreground mt-1 max-w-md">
              {error || 'Tente novamente em instantes.'}
            </p>
          </div>
          <Button onClick={() => refresh()} variant="outline">
            Tentar novamente
          </Button>
        </div>
      );
    }

    if (!participants.length && !loading) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <Card className="w-full max-w-md border-0 shadow-lg">
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Nenhum participante encontrado
              </h3>
              <p className="text-muted-foreground">
                Não há participantes cadastrados para este evento.
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <RoomParticipantsManager
        participants={participants}
        onRefresh={refresh}
        onGeneratePdf={handleGeneratePdfRoomPdfReport}
        isGeneratingPdf={isGeneratePdfRoomMutation}
      />
    );
  };

  const handleBack = () => {
    router.push('/super/participants/room');
  };

  return (
    <PageContainer
      title="Lista de Quartos"
      description="Crie a lista de quartos do seu evento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
