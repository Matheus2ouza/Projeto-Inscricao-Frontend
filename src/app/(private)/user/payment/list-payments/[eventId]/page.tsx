"use client";

import ListPaymentsTable from "../../../../../../features/payment/components/listPayment/ListPayments";
import { useListPayment } from "@/features/payment/hooks/listPayment/useListPayment";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { FileText, RefreshCw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const PAGE_SIZE = 10;
export default function ListPaymentsPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const {
    payments,
    summary,
    total,
    page,
    pageCount,
    loading,
    fetching,
    fetched,
    error,
    setPage,
    refresh,
  } = useListPayment({
    eventId,
    initialPage: 1,
    pageSize: PAGE_SIZE,
  });

  const renderSkeletonGrid = () => {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-muted/30 rounded-lg border">
          <div className="space-y-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  };

  const handleRegisterPayment = () => {
    router.push(`/user/payment/register/${eventId}`);
  };

  const handleViewInscription = (inscriptionId: string) => {
    router.push(
      `/user/inscription/my-inscriptions/${eventId}/${inscriptionId}`,
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center text-destructive">
            <p className="mb-4">
              Erro ao carregar histórico de pagamentos: {error.message}
            </p>
            <Button onClick={refresh}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    if (payments.length === 0) {
      return (
        <div className="py-12 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Nenhum pagamento registrado
            </h3>

            <p className="text-muted-foreground mb-6">
              Não foram encontrados pagamentos para este evento.
              <br />
              Os pagamentos aparecerão aqui quando forem realizados.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleRegisterPayment}
                variant="default"
                className="gap-2"
              >
                Registrar Pagamento
              </Button>

              <Button
                variant="outline"
                onClick={refresh}
                className="gap-2"
                disabled={fetching}
              >
                <RefreshCw
                  className={cn("h-4 w-4", fetching && "animate-spin")}
                />
                {fetching ? "Atualizando..." : "Atualizar"}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <ListPaymentsTable
        summary={summary}
        payments={payments}
        total={total}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onViewInscription={handleViewInscription}
      />
    );
  };

  const handleBack = () => {
    router.replace(`/user/home`);
  };

  return (
    <PageContainer
      title="Histórico de Pagamentos"
      description="Visualize o histórico de pagamentos realizados"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
