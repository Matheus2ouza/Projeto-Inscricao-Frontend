"use client";

import RegisterPaymentDocumentationContent from "@/features/documentation/components/payment/register/registerPaymentDocumentationContent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function RegisterPayment() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Pagamento"
      description="Nesta seção, você encontrará as instruções para registrar um pagamento."
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <RegisterPaymentDocumentationContent />
    </PageContainer>
  );
}
