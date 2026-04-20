'use client';

import PaymentDetailsContent from '@/features/payments/components/adminDetailsPayment/PaymentDetailsContent';
import { useActionsPayment } from '@/features/payments/hooks/adminDetailsPayment/actions/useActionsPayment';
import { usePaymentDetail } from '@/features/payments/hooks/adminDetailsPayment/usePaymentdetail';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useCurrentUser } from '@/shared/context/user-context';
import { useParams, useRouter } from 'next/navigation';

export default function PaymentDetailsAdminPage() {
  const { user } = useCurrentUser();
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

  const { payment, allocations, installments, loading, error, refetch } =
    usePaymentDetail({
      paymentId,
    });

  const {
    handleDeletePayment,
    isDeletingPayment,
    handleModifyReceiptPayment,
    isModifingReceiptPayment,
  } = useActionsPayment();

  const handleBack = () => {
    router.push(`/admin/payments/list-payments/${eventId}`);
  };

  const handleValidPayment = () => {
    router.push(`/admin/payments/analysis/${eventId}/${paymentId}`);
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
        <div className="flex min-h-96 items-center justify-center p-6">
          <div className="text-destructive text-center">
            <p className="mb-4">
              Erro ao carregar detalhes do pagamento: {error}
            </p>
            <Button onClick={refetch}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    return (
      <PaymentDetailsContent
        payment={payment}
        allocations={allocations}
        installments={installments}
        onValidPayment={handleValidPayment}
        onDeletePayment={handleDeletePayment}
        idDeletingPayment={isDeletingPayment}
        onModifyReceiptPayment={handleModifyReceiptPayment}
        isModifingReceiptPayment={isModifingReceiptPayment}
      />
    );
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
