'use client';

import { GroupInscriptionForm } from '@/features/inscriptions/components/inscriptionGrup/GroupInscriptionForm';
import PageContainer from '@/shared/components/layout/PageContainer';
import { useParams, useRouter } from 'next/navigation';

export default function GroupInscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Inscrição em Grupo"
      description="Preencha os campos abaixo para se inscrever individualmente no evento."
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <GroupInscriptionForm eventId={eventId} />
    </PageContainer>
  );
}
