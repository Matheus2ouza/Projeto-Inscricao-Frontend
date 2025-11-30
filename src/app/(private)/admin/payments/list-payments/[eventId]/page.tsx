"use client";

import PaymentsListTable from "@/features/payments/components/PaymentsListTable";
import { usePaymentsList } from "@/features/payments/hooks/usePaymentsList";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function ListPaymentAdminPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;

  const { payments, total, page, pageCount, loading, error, setPage, refetch } =
    usePaymentsList({
      eventId: eventId || "",
      initialPage: 1,
      pageSize: 10,
    });

  const handleBack = () => {
    router.push("/admin/payments/list-payments");
  };

  const handleDetails = (paymentsInscriptionId: string) => {
    router.push(
      `/admin/payments/list-payments/${eventId}/details/${paymentsInscriptionId}`
    );
  };

  if (!eventId) {
    return (
      <PageContainer
        title="Pagamentos por inscrição"
        description="Selecione um evento para visualizar os pagamentos associados"
        backButtonAction={handleBack}
      >
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
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer
        title="Pagamentos por inscrição"
        description="Acompanhe os comprovantes enviados para o evento"
        backButtonAction={handleBack}
      >
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <div className="space-y-2 rounded-xl border p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer
        title="Pagamentos por inscrição"
        description="Acompanhe os comprovantes enviados para o evento"
        backButtonAction={handleBack}
      >
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
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Pagamentos por inscrição"
      description="Acompanhe os comprovantes enviados para o evento"
      backButtonAction={handleBack}
    >
      <PaymentsListTable
        payments={payments}
        total={total}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onViewDetails={handleDetails}
      />
    </PageContainer>
  );
}
