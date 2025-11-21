"use client";

import EventAccountsInscriptions from "@/features/events/components/EventAccountsInscriptions";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EventListInscriptionPage() {
  const params = useParams();
  const eventId = params.id as string | undefined;

  if (!eventId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Evento não encontrado.</p>
          <Button asChild>
            <Link href="/admin/events/manager">Voltar para Eventos</Link>
          </Button>
        </div>
      </div>
    );
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
