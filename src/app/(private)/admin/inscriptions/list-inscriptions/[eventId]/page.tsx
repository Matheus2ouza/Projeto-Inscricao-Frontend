"use client";

import ListInscriptionsTable from "@/features/inscriptions/components/list-inscriptions/ListInscriptionsTable";
import type { InscriptionsFiltersValue } from "@/features/inscriptions/components/list-inscriptions/filters/InscriptionsFilters";
import useInscriptionReports from "@/features/inscriptions/hooks/actions/reports/useInscriptionsReports";
import { useListInscriptions } from "@/features/inscriptions/hooks/list-inscriptions/useListInscriptions";
import { listInscriptionsKeys } from "@/features/inscriptions/hooks/list-inscriptions/useListInscriptionsQuery";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const PAGE_SIZE = 10;

export default function ListInscriptionsAdminPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const [filters, setFilters] = useState<InscriptionsFiltersValue>({
    status: [],
    hideNotAllocated: false,
    orderByCreatedAt: "asc",
    orderByResponsible: "asc",
    limitTime: "all",
  });
  const [responsible, setResponsible] = useState<string>("");

  const convertedLimitTime = useMemo(() => {
    if (filters.limitTime === "all" || !filters.limitTime) {
      return undefined;
    }

    const now = new Date();
    let limitDate: Date;

    if (filters.limitTime.endsWith("h")) {
      const hours = parseInt(filters.limitTime.replace("h", ""), 10);
      limitDate = new Date(now.getTime() - hours * 60 * 60 * 1000);
    } else if (filters.limitTime.endsWith("d")) {
      const days = parseInt(filters.limitTime.replace("d", ""), 10);
      limitDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    } else {
      return undefined;
    }

    return limitDate.toISOString();
  }, [filters.limitTime]);

  const {
    event,
    inscriptions,
    total,
    page,
    pageCount,
    loading,
    fetching,
    fetched,
    error,
    setPage,
    refresh,
  } = useListInscriptions({
    eventId,
    initialPage: 1,
    pageSize: PAGE_SIZE,
    status: filters.status.length > 0 ? filters.status : undefined,
    isGuest: filters.hideNotAllocated ? false : undefined,
    orderByCreatedAt: filters.orderByCreatedAt,
    orderByResponsible: filters.orderByResponsible,
    limitTime: convertedLimitTime,
    responsible: responsible.trim() ? responsible.trim() : undefined,
  });

  const {
    handleGeneratePdfReport,
    isGeneratePdfMutation,
    handleGenerateXlsxReport,
    isGenerateXlsxMutation,
  } = useInscriptionReports();

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <Skeleton className="w-full sm:w-48 h-48 rounded-lg flex-shrink-0" />

              <div className="flex-1 space-y-4">
                <div className="space-y-3">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-muted/30 p-4 rounded-lg space-y-2"
                    >
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-7 w-1/3" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Skeleton className="h-7 w-64" />
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="p-6 space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Skeleton className="h-5 w-10" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 flex-1" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-10" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <div>
            <p className="text-red-600 dark:text-red-400 font-semibold">
              Não foi possível carregar os eventos.
            </p>
            <p className="text-muted-foreground mt-1 max-w-md">
              {error.message || "Tente novamente em instantes."}
            </p>
          </div>
          <Button onClick={() => refresh()} variant="outline">
            Tentar novamente
          </Button>
        </div>
      );
    }

    return (
      <ListInscriptionsTable
        pageSize={PAGE_SIZE}
        event={event}
        inscriptions={inscriptions}
        total={total}
        page={page}
        pageCount={pageCount}
        loadingInscriptions={fetching}
        onPageChange={setPage}
        onSelectInscription={handleViewInscription}
        filters={filters}
        onApplyFilters={(next) => {
          setFilters(next);
          setPage(1);
          queryClient.invalidateQueries({
            queryKey: listInscriptionsKeys.lists(),
          });
        }}
        onClearFilters={() => {
          setFilters({
            status: [],
            hideNotAllocated: false,
            orderByCreatedAt: "asc",
            orderByResponsible: "asc",
            limitTime: "all",
          });
          setResponsible("");
          setPage(1);
          queryClient.invalidateQueries({
            queryKey: listInscriptionsKeys.lists(),
          });
        }}
        onSearchResponsible={(next) => {
          setResponsible(next || "");
          setPage(1);
          queryClient.invalidateQueries({
            queryKey: listInscriptionsKeys.lists(),
          });
        }}
        onDownloadPdf={handleGeneratePdfReport}
        onDownloadXlsx={handleGenerateXlsxReport}
        isGeneratingPdf={isGeneratePdfMutation}
        isGeneratingXlsx={isGenerateXlsxMutation}
      />
    );
  };

  const handleBack = () => {
    router.replace("/admin/inscriptions/list-inscriptions");
  };

  const handleViewInscription = (inscriptionId: string) => {
    router.push(
      `/admin/inscriptions/list-inscriptions/${eventId}/inscription/${inscriptionId}`,
    );
  };

  const getPageTitle = () => {
    if (loading) {
      return "Carregando...";
    }

    if (error) {
      return "Lista de Inscrições";
    }

    if (event?.name) {
      return `${event.name} - Lista de Inscrições`;
    }

    return "Lista de Inscrições";
  };

  const getPageDescription = () => {
    if (loading) {
      return "Carregando...";
    }

    if (error) {
      return "Não foi possível carregar as inscrições deste evento.";
    }

    if (event?.name) {
      return `Abaixo estão listadas todas as inscrições referentes ao evento ${event.name}`;
    }

    return "Abaixo estão listadas todas as inscrições referentes ao evento.";
  };

  return (
    <PageContainer
      title={getPageTitle()}
      description={getPageDescription()}
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
