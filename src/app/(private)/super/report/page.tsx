"use client";

import { useEventsAll } from "@/features/gastos/hooks/useEventsAll";
import ReportTable from "@/features/report/components/ReportPage";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function ReportSuperPage() {
  const router = useRouter();
  const { events, page, pageCount, setPage, loading, error } = useEventsAll({
    initialPage: 1,
    pageSize: 8,
  });

  const handleViewReport = (eventId: string) => {
    router.push(`/super/report/${eventId}`);
  };

  const handleBack = () => {
    router.push("/super/home");
  };

  return (
    <PageContainer
      title="Relatórios"
      description="Consulte o desempenho financeiro dos eventos."
      showBackButton
      backButtonAction={handleBack}
    >
      <ReportTable
        events={events}
        loading={loading}
        error={error}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onViewReport={handleViewReport}
      />
    </PageContainer>
  );
}
