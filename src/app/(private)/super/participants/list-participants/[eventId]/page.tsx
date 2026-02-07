"use client";

import ParticipantsTable from "@/features/participants/components/listParticipants/ParticipantsTable";
import { useParticipants } from "@/features/participants/hooks/listParticipants/useParticipants";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams } from "next/navigation";

export default function ListParticipantsSuperPage() {
  const params = useParams();
  const eventId = params?.eventId as string;

  const {
    accounts,
    loading,
    error,
    page,
    pageCount,
    setPage,
    countAccounts,
    countParticipants,
    countParticipantsMale,
    countParticipantsFemale,
  } = useParticipants({
    eventId: eventId,
    initialPage: 1,
    pageSize: 10,
  });

  if (loading) {
    return (
      <PageContainer
        title="Participantes do Evento"
        description="Visualize todos os participantes inscritos neste evento"
      >
        <div className="rounded-md border">
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer
        title="Participantes do Evento"
        description="Visualize todos os participantes inscritos neste evento"
      >
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Erro ao carregar participantes
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Participantes do Evento"
      description="Visualize todos os participantes inscritos neste evento"
    >
      <ParticipantsTable
        eventId={eventId}
        accounts={accounts}
        countAccounts={countAccounts}
        countParticipants={countParticipants}
        countParticipantsMale={countParticipantsMale}
        countParticipantsFemale={countParticipantsFemale}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </PageContainer>
  );
}
