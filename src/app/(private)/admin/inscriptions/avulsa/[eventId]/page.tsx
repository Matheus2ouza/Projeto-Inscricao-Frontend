"use client";

import AvulsaByEvent from "@/features/inscriptions/components/avulsa/AvulsaByEvent";
import { useAvulsaRegistrations } from "@/features/inscriptions/hooks/avulsa/useAvulsaRegistrations";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const PAGE_SIZE = 15;

export default function AvulsaByEventAdminPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const [page, setPage] = useState(1);

  if (!eventId) return null;

  const { data, isLoading, error } = useAvulsaRegistrations(
    eventId,
    page,
    PAGE_SIZE,
  );

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : null;

  const handleBack = () => {
    router.push("/admin/inscriptions/avulsa");
  };

  const handleCreate = () => {
    router.push(`/admin/inscriptions/avulsa/${eventId}/create`);
  };

  const handleViewDetails = (registrationId: string) => {
    router.push(
      `/admin/inscriptions/avulsa/${eventId}/details/${registrationId}`,
    );
  };

  return (
    <PageContainer
      title="Inscrições Avulsas"
      description={`${data?.total} inscrição${data?.total === 1 ? "" : "ões"} registradas`}
      showBackButton
      backButtonAction={handleBack}
    >
      <AvulsaByEvent
        data={data}
        isLoading={isLoading}
        error={errorMessage}
        page={page}
        pageCount={data?.pageCount ?? 0}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onCreate={handleCreate}
        onViewDetails={handleViewDetails}
      />
    </PageContainer>
  );
}
