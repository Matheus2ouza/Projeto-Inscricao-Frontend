"use client";

import DetailsInscriptionsTable from "@/features/inscriptions/components/DetailsInscriptionTable";
import { useInscriptionDetails } from "@/features/inscriptions/hooks/useInscriptionDetails";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useParams, useRouter } from "next/navigation";

export default function DetailsInscriptionsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  const inscriptionId = params.inscriptionId as string;

  const { data, isLoading, error } = useInscriptionDetails({ inscriptionId });

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Detalhes da Inscrição"
      description={
        data
          ? `Responsável: ${data.responsible} • Valor: ${new Intl.NumberFormat(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              },
            ).format(data.totalValue)}`
          : "Carregando informações da inscrição..."
      }
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <DetailsInscriptionsTable
        eventId={eventId}
        data={data}
        isLoading={isLoading}
        error={error?.message || null}
      />
    </PageContainer>
  );
}
