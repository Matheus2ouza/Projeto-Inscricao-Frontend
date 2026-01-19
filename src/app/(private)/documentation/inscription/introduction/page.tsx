"use client";

import IntroductionInscriptionDocumentationContent from "@/features/documentation/components/inscription/introduction/introductionInscriptionDocumentationContent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function Introduction() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Inscrição"
      description="Introdução ao processo de inscrição"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <IntroductionInscriptionDocumentationContent />
    </PageContainer>
  );
}
