"use client";

import AvulsaTable from "@/features/avulsa/components/avulsaTable";
import { useEventsAll } from "@/features/events/hooks/useEventsAll";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function AvulsaAdminPage() {
  const router = useRouter();
  const { events, page, pageCount, setPage, loading, error } = useEventsAll({
    initialPage: 1,
    pageSize: 8,
  });

  const handleViewEvent = (eventId: string) => {
    router.push(`/admin/inscriptions/avulsa/${eventId}`);
  };

  const handleBack = () => {
    router.push("/admin/home");
  };

  return (
    <PageContainer
      title="Inscrições Avulsas"
      description="Visualize eventos e seus status para cadastrar inscrições avulsas."
      showBackButton
      backButtonAction={handleBack}
    >
      <AvulsaTable
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
