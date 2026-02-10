"use client";

import PaymentDetailsContent from "@/features/payment/components/adminDetailsPayment/PaymentDetailsContent";
import { usePaymentDetail } from "@/features/payment/hooks/adminDetailsPayment/usePaymentdetail";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

export default function PaymentDetailsAdminPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const rawPaymentId = params.paymentId;
  const paymentId = Array.isArray(rawPaymentId)
    ? rawPaymentId[0]
    : rawPaymentId;

  if (!eventId) {
    return null;
  }

  if (!paymentId) {
    return null;
  }

  const { payment, loading, error, refetch } = usePaymentDetail({
    paymentId,
  });

  const handleBack = () => {
    if (eventId) {
      router.push(`/admin/payments/list-payments/${eventId}`);
    } else {
      router.push("/admin/payments/list-payments");
    }
  };

  const renderSkeletonGrid = () => {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-2/5" />
          <Skeleton className="h-72" />
          <Skeleton className="h-12" />
        </CardContent>
      </Card>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center text-destructive">
            <p className="mb-4">
              Erro ao carregar detalhes do pagamento: {error}
            </p>
            <Button onClick={refetch}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    return <PaymentDetailsContent payment={payment} />;
  };

  return (
    <PageContainer
      title="Detalhes do Pagamento"
      description="Informações completas sobre a inscrição referente ao pagamento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
