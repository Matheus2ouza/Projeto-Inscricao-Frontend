"use client";

import PaymentListTable from "@/features/payment/components/adminListPaymant/PaymentListTable";
import { usePaymentList } from "@/features/payment/hooks/adminListPaymants/usePaymentList";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function PaymentListSuperPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const {
    summary,
    payments,
    total,
    page,
    pageCount,
    loading,
    error,
    setPage,
    refetch,
  } = usePaymentList({
    eventId: eventId || "",
    initialPage: 1,
    pageSize: 10,
  });

  const handleBack = () => {
    router.push("/super/payments/list-payments");
  };

  const handleDetails = (paymentsInscriptionId: string) => {
    router.push(
      `/super/payments/list-payments/${eventId}/details/${paymentsInscriptionId}`,
    );
  };

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <div className="space-y-2 rounded-xl border p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!eventId) {
      return (
        <div className="flex min-h-96 items-center justify-center text-center">
          <div className="space-y-2 max-w-sm">
            <AlertTriangle className="mx-auto h-8 w-8 text-amber-500" />
            <p className="text-lg font-medium text-foreground">
              Nenhum evento selecionado
            </p>
            <p className="text-sm text-muted-foreground">
              Utilize a tela anterior para escolher o evento que deseja
              consultar.
            </p>
            <Button onClick={handleBack} className="mt-4">
              Voltar para seleção
            </Button>
          </div>
        </div>
      );
    }

    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <div className="flex min-h-96 items-center justify-center text-center">
          <div className="space-y-4 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                Erro ao carregar os pagamentos
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={() => refetch()}>Tentar novamente</Button>
          </div>
        </div>
      );
    }

    return (
      <PaymentListTable
        summary={summary}
        payments={payments}
        total={total}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onViewDetails={handleDetails}
      />
    );
  };

  return (
    <PageContainer
      title="Pagamentos por Inscrição"
      description="Acompanhe os comprovantes enviados para o evento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
