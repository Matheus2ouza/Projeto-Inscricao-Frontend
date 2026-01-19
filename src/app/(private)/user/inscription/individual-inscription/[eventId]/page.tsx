"use client";

import IndividualInscriptionForm from "@/features/inscriptions/components/inscriptionIndiv/IndivInscriptionForm";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useParams, useRouter } from "next/navigation";

export default function IndividualInscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const handleBack = () => {
    window.history.back();
  };

  return (
    <PageContainer
      title="Inscrição Individual"
      description="Preencha os campos abaixo para se inscrever individualmente no evento."
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <IndividualInscriptionForm eventId={eventId} />
    </PageContainer>
  );
}
