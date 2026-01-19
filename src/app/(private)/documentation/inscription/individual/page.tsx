"use client";

import IndividualInscriptionDocumentationContent from "@/features/documentation/components/inscription/individual/individualInscriptionDocumentationContent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function IndividualInscriptionDocumentationPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Inscrição Individual"
      description="Introdução ao processo de inscrição individual"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <IndividualInscriptionDocumentationContent />
    </PageContainer>
  );
}
