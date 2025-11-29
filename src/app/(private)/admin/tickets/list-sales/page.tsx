"use client";

import { useEventsAll } from "@/features/events/hooks/useEventsAll";
import TicketsTable from "@/features/tickets/components/TicketsTable";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function SelectEventForListAdminPage() {
  const router = useRouter();
  const { events, page, pageCount, setPage, loading, error } = useEventsAll({
    initialPage: 1,
    pageSize: 8,
  });

  const handleViewEvent = (eventId: string) => {
    router.push(`/admin/tickets/list-sales/${eventId}`);
  };

  const handleBack = () => {
    router.push("/admin/home");
  };

  return (
    <PageContainer
      title="Tickets"
      description="Lista de vendas dos tickets de alimentação."
      showBackButton
      backButtonAction={handleBack}
    >
      <TicketsTable
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
