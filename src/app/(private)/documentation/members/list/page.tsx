"use client";

import ListMembersDocumentationContent from "@/features/documentation/components/members/list/listMembersDocumentationContent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function ListMembers() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Listar Membros"
      description="Nesta seção, você encontrará as instruções para listar todos os membros."
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <ListMembersDocumentationContent />
    </PageContainer>
  );
}
