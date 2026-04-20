'use client';
import DetailsPaymentTable from '@/features/payments/components/adminAnalysisPayment/DetailsPayment';
import { useActionsPayment } from '@/features/payments/hooks/analysisPayment/actions/useActionsPayment';
import { useAnalysisPaymentDetails } from '@/features/payments/hooks/analysisPayment/analysisPaymentDetails';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

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
    handleApprovePayment,
    isApprovingPayment,
    handleRejectPayment,
    isRejectingPayment,
    handleReversePayment,
    isReversingPayment,
    handleModifyReceiptPayment,
    isModifingReceiptPayment,
  } = useActionsPayment();

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-muted/30 mb-6 flex flex-col items-start justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
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
        <div className="flex min-h-96 items-center justify-center p-6">
          <div className="text-destructive text-center">
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
        onApprovePayment={handleApprovePayment}
        isApproving={isApprovingPayment}
        onRejectPayment={handleRejectPayment}
        isRejecting={isRejectingPayment}
        onRevertPayment={handleReversePayment}
        isReversing={isReversingPayment}
        onModifyReceiptPayment={handleModifyReceiptPayment}
        isModifingReceiptPayment={isModifingReceiptPayment}
      />
    );
  };

  const handleBack = () => {
    router.push(`/super/payments/analysis/${eventId}`);
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
