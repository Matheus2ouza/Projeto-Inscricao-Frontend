"use client";

import MyInscriptionDocumentationContent from "@/features/documentation/components/inscription/my-inscription/my-inscriptionDocumentationContent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function MyInscription() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Minhas Inscrições"
      description="Introdução ao processo de gerenciamento de inscrições"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <MyInscriptionDocumentationContent />
    </PageContainer>
  );
}
