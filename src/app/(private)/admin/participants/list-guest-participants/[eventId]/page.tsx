"use client";

import ListGuestParticipants from "@/features/participants/components/list-guest-participants/listGuestParticipants";
import { useListGuestParticipants } from "@/features/participants/hooks/list-guest-participants/useListGuestParticipants";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

export default function ListGuestParticipantsAdminPage() {
  const router = useRouter();
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const {
    guestParticipants,
    countGuestParticipants,
    countGuestParticipantsMale,
    countGuestParticipantsFemale,
    total,
    page,
    pageCount,
    loading,
    error,
    setPage,
  } = useListGuestParticipants({
    eventId: eventId,
    initialPage: 1,
    pageSize: 10,
  });

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
      <ListGuestParticipants
        guestParticipants={guestParticipants}
        countGuestParticipants={countGuestParticipants}
        countGuestParticipantsMale={countGuestParticipantsMale}
        countGuestParticipantsFemale={countGuestParticipantsFemale}
        total={total}
        page={page}
        pageSize={10}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    );
  };

  const handleBack = () => {
    router.push("/admin/home");
  };

  return (
    <PageContainer
      title="Lista de Participantes Convidados"
      description="Visualize todos os participantes já inscritos nesse evento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
