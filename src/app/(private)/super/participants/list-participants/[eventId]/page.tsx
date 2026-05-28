'use client';

import { ListParticipantsFiltersValue } from '@/features/participants/components/list-participants/filters/ListParticipantsFilters';
import ListParticipants from '@/features/participants/components/list-participants/ListParticipants';
import { useParticipantsReports } from '@/features/participants/hooks/actions/useParticipantsReports';
import { useListParticipants } from '@/features/participants/hooks/list-participants/useListParticipants';
import { useInvalidateParticipants } from '@/features/participants/hooks/list-participants/useListParticipantsQuery';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const PAGE_SIZE = 20;
export default function ListGuestParticipantsSuperPage() {
  const router = useRouter();
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId =
    (Array.isArray(rawEventId) ? rawEventId[0] : rawEventId) ?? '';

  const [filters, setFilters] = useState<ListParticipantsFiltersValue>({
    inscriptionStatus: [],
    typeInscriptions: [],
    orderByName: 'asc',
  });
  const [responsible, setResponsible] = useState<string>('');

  const {
    participants,
    countParticipants,
    countParticipantsMale,
    countParticipantsFemale,
    total,
    typesInscriptionsInUse,
    page,
    pageCount,
    loading,
    error,
    setPage,
    refresh,
  } = useListParticipants({
    eventId: eventId,
    initialPage: 1,
    pageSize: PAGE_SIZE,

    inscriptionStatus: filters.inscriptionStatus,
    typeInscriptions: filters.typeInscriptions,
    orderByName: filters.orderByName,
  });

  const { invalidateLists } = useInvalidateParticipants();

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
        eventId={eventId}
        participants={participants}
        countParticipants={countParticipants}
        countParticipantsMale={countParticipantsMale}
        countParticipantsFemale={countParticipantsFemale}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        pageCount={pageCount}
        onPageChange={setPage}
        filters={filters}
        typesInscriptionsInUse={typesInscriptionsInUse}
        onApplyFilters={(next) => {
          setFilters(next);
          setPage(1);
          invalidateLists();
        }}
        onClearFilters={() => {
          setFilters({
            inscriptionStatus: [],
            typeInscriptions: [],
            orderByName: 'asc',
          });
          setResponsible('');
          setPage(1);
          invalidateLists();
        }}
        onGenerateParticipantsByLocalityPdf={({
          separate,
          reduced,
          summary,
          typeInscriptions,
          columns,
          startDate,
          endDate,
          inscriptionsStatus,
        }) =>
          handleGenerateLocalityPdfReport({
            eventId,
            separate,
            reduced,
            summary,
            typeInscriptions,
            columns,
            startDate,
            endDate,
            inscriptionsStatus,
          })
        }
        onGenerateParticipantsByLocalityXlsx={({
          separate,
          summary,
          typeInscriptions,
          columns,
          startDate,
          endDate,
          inscriptionsStatus,
        }) =>
          handleGenerateLocalityXlsxReport({
            eventId,
            separate,
            summary,
            typeInscriptions,
            columns,
            startDate,
            endDate,
            inscriptionsStatus,
          })
        }
        isGeneratingParticipantsByLocalityPdf={isGeneratePdfLocalityMutation}
        isGeneratingParticipantsByLocalityXlsx={isGenerateXlsxLocalityMutation}
      />
    );
  };

  const handleBack = () => {
    router.push('/super/participants/list-participants');
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
