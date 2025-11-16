"use client";

import SelectEventTable from "@/features/participants/components/SelectEventTable";
import { useEventsForParticipants } from "@/features/participants/hooks/useEventsForParticipants";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardBody, CardFooter } from "@heroui/react";

export default function SelectEventPage() {
  const { events, loading, error, page, pageCount, setPage } =
    useEventsForParticipants({
      initialPage: 1,
      pageSize: 8,
    });

  if (loading) {
    return (
      <PageContainer
        title="Selecionar Evento"
        description="Escolha um evento para visualizar os participantes"
        
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card
              key={index}
              className="w-full border border-transparent shadow-md bg-white dark:bg-zinc-900 dark:border-zinc-800"
            >
              <CardBody className="p-0">
                <Skeleton className="w-full h-48 rounded-t-xl" />
              </CardBody>
              <CardFooter className="flex flex-col items-start p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer
        title="Selecionar Evento"
        description="Escolha um evento para visualizar os participantes"
      >
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Erro ao carregar eventos
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Selecionar Evento"
      description="Escolha um evento para visualizar os participantes"
    >
      <SelectEventTable
        events={events}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </PageContainer>
  );
}
