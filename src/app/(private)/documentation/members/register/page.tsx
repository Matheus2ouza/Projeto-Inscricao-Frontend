"use client";

import RegisterMembersDocumentationContent from "@/features/documentation/components/members/register/registerMembersDocumentationContent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function RegisterMembers() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Registrar Membro"
      description="Nesta seção, você encontrará as instruções para registrar um novo membro."
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <RegisterMembersDocumentationContent />
    </PageContainer>
  );
}
