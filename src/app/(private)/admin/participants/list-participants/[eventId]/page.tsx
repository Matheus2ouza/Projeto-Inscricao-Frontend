'use client';

import ListParticipants from '@/features/participants/components/list-participants/ListParticipants';
import { useParticipantsReports } from '@/features/participants/hooks/actions/useParticipantsReports';
import { useListParticipants } from '@/features/participants/hooks/list-participants/useListParticipants';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

const PAGE_SIZE = 20;
export default function ListGuestParticipantsAdminPage() {
  const router = useRouter();
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId =
    (Array.isArray(rawEventId) ? rawEventId[0] : rawEventId) ?? '';

  const {
    participants: guestParticipants,
    countParticipants: countGuestParticipants,
    countParticipantsMale: countGuestParticipantsMale,
    countParticipantsFemale: countGuestParticipantsFemale,
    total,
    page,
    pageCount,
    loading,
    error,
    setPage,
  } = useListParticipants({
    eventId: eventId,
    initialPage: 1,
    pageSize: PAGE_SIZE,
  });

  const {
    // pdf
    handleGenerateLocalityPdfReport,
    isGeneratePdfLocalityMutation,

    // xlsx
    handleGenerateLocalityXlsxReport,
    isGenerateXlsxLocalityMutation,
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
        <div className="flex min-h-96 items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-600">
              Erro ao carregar lista de participantes
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      );
    }

    return (
      <ListParticipants
        participants={guestParticipants}
        countParticipants={countGuestParticipants}
        countParticipantsMale={countGuestParticipantsMale}
        countParticipantsFemale={countGuestParticipantsFemale}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        pageCount={pageCount}
        onPageChange={setPage}
        onGenerateParticipantsByLocalityPdf={({
          separate,
          reduced,
          summary,
          columns,
        }) =>
          handleGenerateLocalityPdfReport({
            eventId,
            separate,
            reduced,
            summary,
            columns,
          })
        }
        onGenerateParticipantsByLocalityXlsx={({
          separate,
          summary,
          columns,
        }) =>
          handleGenerateLocalityXlsxReport({
            eventId,
            separate,
            summary,
            columns,
          })
        }
        isGeneratingParticipantsByLocalityPdf={isGeneratePdfLocalityMutation}
        isGeneratingParticipantsByLocalityXlsx={isGenerateXlsxLocalityMutation}
      />
    );
  };

  const handleBack = () => {
    router.push('/admin/participants/list-participants');
  };

  return (
    <PageContainer
      title="Lista de Participantes"
      description="Visualize todos os participantes já inscritos nesse evento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
