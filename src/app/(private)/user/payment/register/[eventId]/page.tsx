'use client';

import RegisterPaymentTable from '@/features/payments/components/registerPayment/RegisterPayment';
import PageContainer from '@/shared/components/layout/PageContainer';
import { useParams, useRouter } from 'next/navigation';

export default function RegisterPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const handleViewPaymentDetails = (paymentId: string) => {
    router.push(`/user/payment/register/${eventId}/${paymentId}`);
  };

  const handleRegisterPaymentPix = (ids: string[], totalValue: number) => {
    const search = new URLSearchParams();
    if (ids.length > 0) search.set('inscriptions', ids.join(','));
    search.set('remainingValue', String(totalValue));
    // O allowCard será obtido pelo hook dentro do componente
    router.push(`/user/payment/register/${eventId}/pix?${search}`);
  };

  const handleRegisterPaymentCard = (ids: string[], totalValue: number) => {
    const search = new URLSearchParams();
    if (ids.length > 0) search.set('inscriptions', ids.join(','));
    search.set('totalValue', String(totalValue));
    router.push(`/user/payment/register/${eventId}/card?${search.toString()}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Registrar Pagamento"
      description="Selecione as inscrições pendentes para realizar o pagamento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <RegisterPaymentTable
        eventId={eventId}
        onViewPaymentDetails={handleViewPaymentDetails}
        onRegisterPaymentPix={handleRegisterPaymentPix}
        onRegisterPaymentCard={handleRegisterPaymentCard}
      />
    </PageContainer>
  );
}
