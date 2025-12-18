"use client";

import ParticipantsTable from "@/features/participants/components/ParticipantsTable";
import { useParticipants } from "@/features/participants/hooks/useParticipants";
import PageContainer from "@/shared/components/layout/PageContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams } from "next/navigation";

export default function ListParticipantsAdminPage() {
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
  } = useParticipants({
    eventId: eventId || "",
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
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Card className="border-2 border-primary/20 bg-white/60 shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-semibold text-foreground">
              Contas cadastradas
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Quantas contas estão vinculadas ao evento
            </CardDescription>
          </CardHeader>
          <CardContent className="text-4xl font-bold text-foreground">
            {countAccounts}
          </CardContent>
        </Card>
        <Card className="border-2 border-primary/20 bg-white/60 shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-semibold text-foreground">
              Participantes Inscritos
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Total geral de inscritos por conta
            </CardDescription>
          </CardHeader>
          <CardContent className="text-4xl font-bold text-foreground">
            {countParticipants}
          </CardContent>
        </Card>
      </div>
      <ParticipantsTable
        eventId={eventId}
        accounts={accounts}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </PageContainer>
  );
}
