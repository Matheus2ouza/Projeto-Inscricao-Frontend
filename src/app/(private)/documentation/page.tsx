"use client";

import IntroductionDocumentationContent from "@/features/documentation/components/introduction/IntroductionDocumentationContent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function Documentation() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Documentação"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <IntroductionDocumentationContent />
    </PageContainer>
  );
}
