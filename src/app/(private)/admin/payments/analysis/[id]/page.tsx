"use client";

import PaymentsAnalysisTable from "@/features/analysis/payment/components/PaymentsAnalysisTable";
import { useAnalysisPaymentsQuery } from "@/features/analysis/payment/hooks/useAnalysisInscriptionsQuery";
import { useEvent } from "@/features/events/hooks/useEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { CreditCard } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EventInscriptionsAnalysisAdminPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const { event, loading: eventLoading, error: eventError } = useEvent(eventId);
  const {
    data: analysisData,
    isLoading: analysisLoading,
    error: analysisError,
  } = useAnalysisPaymentsQuery(eventId, 1, 1000);

  const loading = eventLoading || analysisLoading;
  const error = eventError
    ? new Error(eventError)
    : analysisError instanceof Error
      ? analysisError
      : null;

  if (loading) {
    return (
      <PageContainer
        title="Análise de Pagamentos"
        description="Visualize as inscrições por Conta"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
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
        title="Análise de Pagamentos"
        description="Visualize as inscrições por Conta"
      >
        <div className="flex items-center justify-center min-h-96">
          <Card className="w-full max-w-md border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Erro ao carregar pagamentos
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error instanceof Error ? error.message : "Erro desconhecido"}
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

  const handleViewPayment = (inscriptionId: string, eventStatus: string) => {
    const queryParams = new URLSearchParams({
      eventId,
      eventStatus,
    });
    router.push(
      `/admin/payments/payment/${inscriptionId}?${queryParams.toString()}`
    );
  };

  return (
    <PageContainer
      title="Análise de Pagamentos"
      description="Visualize as inscrições por Conta"
    >
      <PaymentsAnalysisTable
        eventId={eventId}
        event={event}
        analysisData={analysisData || null}
        loading={loading}
        error={error}
        onViewPayment={handleViewPayment}
      />
    </PageContainer>
  );
}
