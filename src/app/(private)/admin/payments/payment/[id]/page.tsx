"use client";

import PaymentDetailAnalysis from "@/features/analysis/payment/components/paymentDetailAnalysis";
import { usePaymentDetailsQuery } from "@/features/analysis/payment/hooks/usePaymentDetails";
import { PaymentStatus } from "@/features/analysis/payment/types/analysisTypes";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { CreditCard } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function PaymentsDetailInsideAnalysisAdminPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const inscriptionId = params.id as string;
  const eventId = (searchParams.get("eventId") as string) || "";
  const eventStatus = searchParams.get("eventStatus") || "OPEN";

  // Determinar quais status de pagamento buscar baseado no status do evento
  const paymentStatusToFetch = useMemo(() => {
    if (eventStatus === "OPEN") {
      return [
        PaymentStatus.APPROVED,
        PaymentStatus.UNDER_REVIEW,
        PaymentStatus.REFUSED,
      ];
    }
    return [PaymentStatus.APPROVED, PaymentStatus.UNDER_REVIEW];
  }, [eventStatus]);

  const {
    data: paymentData,
    isLoading: loading,
    error,
    page,
    setPage,
    pageCount,
    total,
  } = usePaymentDetailsQuery(inscriptionId, paymentStatusToFetch);

  if (loading) {
    return (
      <PageContainer
        title="Detalhes do Pagamento"
        description="Análise detalhada dos pagamentos da inscrição"
      >
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer
        title="Detalhes do Pagamento"
        description="Análise detalhada dos pagamentos da inscrição"
      >
        <div className="flex items-center justify-center min-h-96">
          <Card className="w-full max-w-md border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Erro ao carregar detalhes
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error?.message || "Erro desconhecido"}
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/payments/analysis">Voltar para Análise</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Detalhes do Pagamento"
      description="Análise detalhada dos pagamentos da inscrição"
    >
      <PaymentDetailAnalysis
        inscriptionId={inscriptionId}
        eventId={eventId}
        eventStatus={eventStatus}
        paymentData={paymentData || null}
        page={page}
        pageCount={pageCount}
        total={total}
        onPageChange={setPage}
      />
    </PageContainer>
  );
}
