"use client";

import CreateAvulsaForm from "@/features/avulsa/components/CreateAvulsaForm";
import { useCreateAvulsaRegistration } from "@/features/avulsa/hooks/useCreateAvulsaRegistration";
import type { CreateAvulsaFormData } from "@/features/inscriptions/schema/avulsa/avulsaSchema";
import type { CreateInscriptionAvulInput } from "@/features/inscriptions/types/avulsa/avulsaTypes";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function CreateAvulsaSuperPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.id;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const createAvulsaMutation = useCreateAvulsaRegistration();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data: CreateAvulsaFormData) => {
      if (!eventId) return;

      const payload: CreateInscriptionAvulInput = {
        eventId,
        responsible: data.responsible,
        phone: data.phone || undefined,
        totalValue: data.participants.reduce((total, participant) => {
          return (
            total +
            participant.payments.reduce(
              (sum, payment) => sum + Number(payment.value || 0),
              0
            )
          );
        }, 0),
        status: data.status,
        participants: data.participants.map((participant) => ({
          name: participant.name,
          gender: participant.gender,
          payments: participant.payments.map((payment) => ({
            paymentMethod: payment.paymentMethod,
            value: payment.value.trim(),
          })),
        })),
      };

      try {
        await createAvulsaMutation.mutateAsync(payload);
        router.back();
        setErrorMessage(null);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error || "Erro");
        setErrorMessage(message);
      }
    },
    [createAvulsaMutation, eventId, router]
  );

  if (!eventId) return null;

  return (
    <PageContainer
      title="Nova Inscrição Avulsa"
      description="Registre um cadastro rápido vinculado ao evento."
      showBackButton
      backButtonAction={() => router.back()}
    >
      <CreateAvulsaForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isSubmitting={createAvulsaMutation.isPending}
        error={errorMessage}
      />
    </PageContainer>
  );
}
