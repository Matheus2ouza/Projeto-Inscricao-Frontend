"use client";

import PaymentDetailsContent from "@/features/payments/components/PaymentDetailsContent";
import { usePaymentDetail } from "@/features/payments/hooks/usePaymentDetail";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { CreditCard } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function PaymentDetailsAdminPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  const paymentId = params.paymentId as string;

  const { data, isLoading, error } = usePaymentDetail(paymentId);

  const handleBack = () => {
    if (eventId) {
      router.push(`/admin/payments/list-payments/${eventId}`);
    } else {
      router.push("/admin/payments/list-payments");
    }
  };

  if (isLoading) {
    return (
      <PageContainer
        title="Detalhes do Pagamento"
        description="Informações completas sobre o comprovante selecionado"
        backButtonAction={handleBack}
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-2/5" />
            <Skeleton className="h-72" />
            <Skeleton className="h-12" />
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (error || !data) {
    return (
      <PageContainer
        title="Detalhes do Pagamento"
        description="Informações completas sobre o comprovante selecionado"
        backButtonAction={handleBack}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="border-0 shadow-lg w-full max-w-md">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <CreditCard className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-red-600">
                Erro ao carregar o pagamento
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {error?.message ||
                  "Não foi possível encontrar o pagamento solicitado."}
              </p>
              <Button onClick={handleBack}>Voltar para a lista</Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Detalhes do Pagamento"
      description="Informações completas sobre a inscrição referente ao pagamento"
      backButtonAction={handleBack}
    >
      <PaymentDetailsContent data={data} />
    </PageContainer>
  );
}
