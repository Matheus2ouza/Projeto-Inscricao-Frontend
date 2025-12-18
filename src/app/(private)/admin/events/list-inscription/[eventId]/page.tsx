"use client";

import EventAccountsInscriptions from "@/features/events/components/EventAccountsInscriptions";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useParams } from "next/navigation";

export default function EventListInscriptionPage() {
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  if (!eventId) {
    return null;
  }

  return (
    <PageContainer
      title="Lista de Inscrições"
      description="Visualise as inscrições por Conta"
    >
      <EventAccountsInscriptions eventId={eventId} />
    </PageContainer>
  );
}
