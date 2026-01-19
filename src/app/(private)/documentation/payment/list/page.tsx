"use client";

import ListPaymentDocumentationContent from "@/features/documentation/components/payment/list/listPaymentDocumentationContent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function ListPayment() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Listar Pagamentos"
      description="Nesta seção, você encontrará as instruções para listar todos os pagamentos realizados."
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <ListPaymentDocumentationContent />
    </PageContainer>
  );
}
