"use client";

import ReportFinancialDetails from "@/features/report/components/reportFinancial/reportFinancial";
import { useReportFinancial } from "@/features/report/hooks/reportFinancial/useReportFinancial";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ReportDetalheSuperPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const [showDetails, setShowDetails] = useState(true);

  if (!eventId) return null;

  const { data, loading, error, refetch } = useReportFinancial({
    eventId,
    details: showDetails,
  });

  const handleBack = () => {
    router.push("/super/report/financial");
  };

  if (loading) {
    return (
      <PageContainer
        title="Relatório Financeiro"
        description="Dados consolidados do evento selecionado."
        showBackButton
        backButtonAction={handleBack}
      >
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="rounded-xl border bg-white p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <Skeleton className="h-48 w-full lg:w-64 rounded-2xl" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer
        title="Relatório Financeiro"
        description="Dados consolidados do evento selecionado."
        showBackButton
        backButtonAction={handleBack}
      >
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-red-100 shadow-sm">
          <div className="bg-red-50 p-4 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Erro ao carregar relatório
          </h3>
          <p className="text-slate-500 max-w-md mb-6">
            Não foi possível carregar os dados financeiros do evento. Por favor,
            tente novamente.
          </p>
          <Button onClick={() => refetch()} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Relatório Financeiro"
      description="Dados consolidados do evento selecionado."
      showBackButton
      backButtonAction={handleBack}
    >
      <ReportFinancialDetails
        data={data}
        showDetails={showDetails}
        onToggleDetails={setShowDetails}
        loading={loading}
      />
    </PageContainer>
  );
}
