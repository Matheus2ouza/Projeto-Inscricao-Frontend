'use client';

import { GroupInscriptionForm } from '@/features/inscriptions/components/inscriptionGrup/GroupInscriptionForm';
import { useFormInscriptionGrup } from '@/features/inscriptions/hooks/inscriptionGrup/useFormInscriptionGrup';
import PageContainer from '@/shared/components/layout/PageContainer';
import { useParams, useRouter } from 'next/navigation';

export default function GroupInscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const handleBack = () => {
    router.push('/user/home');
  };

  const hookData = useFormInscriptionGrup({ eventId });

  return (
    <PageContainer
      title="Inscrição Individual"
      description="Preencha os campos abaixo para se inscrever individualmente no evento."
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <GroupInscriptionForm hookData={hookData} eventId={eventId} />
    </PageContainer>
  );
}
