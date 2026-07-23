'use client';

import ListPayments from '@/features/payments/components/userListPayment/ListPayments';
import PageContainer from '@/shared/components/layout/PageContainer';
import { useParams, useRouter } from 'next/navigation';

export default function ListPaymentsPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const handleViewInscription = (inscriptionId: string) => {
    router.push(
      `/user/inscription/my-inscriptions/${eventId}/${inscriptionId}`,
    );
  };

  const handleBack = () => {
    router.replace(`/user/home`);
  };

  return (
    <PageContainer
      title="Histórico de Pagamentos"
      description="Visualize o histórico de pagamentos realizados"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <ListPayments
        eventId={eventId}
        onViewInscription={handleViewInscription}
      />
    </PageContainer>
  );
}
