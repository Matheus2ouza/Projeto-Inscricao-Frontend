"use client";

import ListParticipants from "@/features/participants/components/list-participants/ListParticipants";
import { useParticipantsExportActions } from "@/features/participants/hooks/list-participants/actions/useParticipantsExportActions";
import { useListParticipants } from "@/features/participants/hooks/list-participants/useListParticipants";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

const PAGE_SIZE = 20;
export default function ListGuestParticipantsSuperPage() {
  const router = useRouter();
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId =
    (Array.isArray(rawEventId) ? rawEventId[0] : rawEventId) ?? "";

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
  } = useParticipantsExportActions();

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-2 w-full">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
              <Skeleton className="h-3 w-44" />
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <Skeleton className="h-6 w-56" />
          </div>
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-16 ml-auto" />
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
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
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
        onGenerateParticipantsByLocalityPdf={({ separate, reduced }) =>
          handleGenerateLocalityPdfReport({ eventId, separate, reduced })
        }
        onGenerateParticipantsByLocalityXlsx={({ separate }) =>
          handleGenerateLocalityXlsxReport({ eventId, separate })
        }
        isGeneratingParticipantsByLocalityPdf={isGeneratePdfLocalityMutation}
        isGeneratingParticipantsByLocalityXlsx={isGenerateXlsxLocalityMutation}
      />
    );
  };

  const handleBack = () => {
    router.push("/super/participants/list-participants");
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
