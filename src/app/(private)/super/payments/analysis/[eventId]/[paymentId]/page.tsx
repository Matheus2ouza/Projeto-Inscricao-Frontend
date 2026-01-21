"use client";
import DetailsPaymentTable from "@/features/payment/components/analysisPayment/detailsPayment";
import { useAnalysisPaymentDetails } from "@/features/payment/hook/analysisPayment/analysisPaymentDetails";
import { usePaymentActions } from "@/features/payment/hook/analysisPayment/usePaymentActions";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

export default function PaymentDetailsSuperPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const rawPaymentId = params.paymentId;
  const paymentId = Array.isArray(rawPaymentId)
    ? rawPaymentId[0]
    : rawPaymentId;

  if (!eventId || !paymentId) {
    return null;
  }

  const { payment, loading, fetching, fetched, error, refresh } =
    useAnalysisPaymentDetails({
      paymentId,
    });

  const {
    approvePayment,
    rejectPayment,
    reversePayment,
    isApproving,
    isRejecting,
    isReversing,
  } = usePaymentActions();

  const renderSkeletonGrid = () => {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-muted/30 rounded-lg border">
          <div className="space-y-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-[420px] w-full" />
      </div>
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
              Erro ao carregar histórico de pagamentos: {error.message}
            </p>
            <Button onClick={refresh}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    return (
      <DetailsPaymentTable
        payment={payment}
        onApprovePayment={() => handleApprovePayment(paymentId)}
        onRejectPayment={(reason) => handleRejectPayment(paymentId, reason)}
        onRevertPayment={() => handleRevertPayment(paymentId)}
        isApproving={isApproving}
        isRejecting={isRejecting}
        isReversing={isReversing}
      />
    );
  };

  const handleApprovePayment = async (paymentId: string) => {
    await approvePayment(paymentId);
  };

  const handleRejectPayment = async (paymentId: string, reason: string) => {
    await rejectPayment({ paymentId, reason });
  };

  const handleRevertPayment = async (paymentId: string) => {
    await reversePayment(paymentId);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Análise de Pagamentos"
      description="Visualize todos os pagamentos realizados para este evento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
