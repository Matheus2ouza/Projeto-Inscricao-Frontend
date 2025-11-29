"use client";

import InscriptionsAnalysisTable from "@/features/analysis/inscription/components/InscriptionsAnalysisTable";
import { useInscriptionsForAnalysis } from "@/features/analysis/inscription/hooks/useInscriptionsForAnalysis";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useParams, useRouter } from "next/navigation";

export default function EventInscriptionsAnalysisSuperPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.id;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const { analysisData, loading, error, page, pageCount, total, setPage } =
    useInscriptionsForAnalysis({
      eventId,
      initialPage: 1,
      pageSize: 15,
    });
  const handleBack = () => {
    router.push("/super/inscriptions/analysis");
  };

  const handleViewInscription = (inscriptionId: string) => {
    router.push(`/super/inscriptions/analysis/inscription/${inscriptionId}`);
  };

  return (
    <PageContainer
      title="Inscrições do Evento"
      description="Veja os detalhes das inscrições e avance na análise."
      showBackButton
      backButtonAction={handleBack}
    >
      <InscriptionsAnalysisTable
        analysisData={analysisData}
        loading={loading}
        error={error}
        page={page}
        pageCount={pageCount}
        total={total}
        onPageChange={setPage}
        onViewInscription={handleViewInscription}
        listPath="/super/inscriptions/analysis"
      />
    </PageContainer>
  );
}
