"use client";

import InGroupInscriptionDocumentationContent from "@/features/documentation/components/inscription/in-group/InGroupInscriptionDocumentationContent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function InGroupInscriptionDocumentationPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Inscrição em Grupo"
      description="Introdução ao processo de inscrição em grupo"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <InGroupInscriptionDocumentationContent />
    </PageContainer>
  );
}
