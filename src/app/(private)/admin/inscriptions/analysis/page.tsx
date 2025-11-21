"use client";

import AnalysisInscriptionTable from "@/features/analysis/inscription/components/AnalysisInscriptionTable";
import { useEventsForAnalysis } from "@/features/analysis/inscription/hooks/useEventsForAnalysis";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function AnalysisInscriptionAdminPage() {
  const router = useRouter();
  const { events, loading, error, page, pageCount, setPage } =
    useEventsForAnalysis({ initialPage: 1, pageSize: 8 });

  const handleBack = () => {
    router.push("/admin/home");
  };

  const handleViewEvent = (eventId: string) => {
    router.push(`/admin/inscriptions/analysis/${eventId}`);
  };

  return (
    <PageContainer
      title="Análise de Inscrições"
      description="Monitore o progresso da análise das inscrições dos eventos."
      showBackButton
      backButtonAction={handleBack}
    >
      <AnalysisInscriptionTable
        events={events}
        loading={loading}
        error={error}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onViewEvent={handleViewEvent}
      />
    </PageContainer>
  );
}
