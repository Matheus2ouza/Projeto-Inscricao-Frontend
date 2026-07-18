'use client';

import IndividualInscriptionForm from '@/features/inscriptions/components/inscriptionIndiv/IndivInscriptionForm';
import PageContainer from '@/shared/components/layout/PageContainer';
import { useParams } from 'next/navigation';

export default function IndividualInscriptionPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  return (
    <PageContainer
      title="Inscrição Individual"
      description="Preencha os campos abaixo para se inscrever individualmente no evento."
      showBackButton={true}
    >
      <IndividualInscriptionForm eventId={eventId} />
    </PageContainer>
  );
}
