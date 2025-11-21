"use client";

import SpensTable from "@/features/gastos/components/SpensTable";
import { useEventsAll } from "@/features/events/hooks/useEventsAll";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function SpentsAdminPage() {
  const router = useRouter();
  const { events, page, pageCount, setPage, loading, error } = useEventsAll({
    initialPage: 1,
    pageSize: 8,
  });

  const handleViewEvent = (eventId: string) => {
    router.push(`/admin/gastos/${eventId}`);
  };

  const handleBack = () => {
    router.push("/admin/home");
  };

  return (
    <PageContainer
      title="Gastos"
      description="Acompanhe e registre os gastos vinculados aos eventos."
      showBackButton
      backButtonAction={handleBack}
    >
      <SpensTable
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
