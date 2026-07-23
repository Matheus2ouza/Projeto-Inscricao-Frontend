'use client';

import MyInscriptionsTable from '@/features/inscriptions/components/myInscriptions/MyInscriptionsTable';
import PageContainer from '@/shared/components/layout/PageContainer';
import { useParams, useRouter } from 'next/navigation';

const PAGE_SIZE = 10;
export default function MyInscriptionsPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const handleSelectInscription = (inscriptionId: string) => {
    router.push(
      `/user/inscription/my-inscriptions/${eventId}/${inscriptionId}`,
    );
  };

  const handleBack = () => {
    router.replace(`/user/home`);
  };

  return (
    <PageContainer
      title="Minhas Inscrições"
      description="Visualize o histórico de inscrições realizadas"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <MyInscriptionsTable
        eventId={eventId}
        onSelectInscription={handleSelectInscription}
        pageSize={PAGE_SIZE}
      />
    </PageContainer>
  );
}
