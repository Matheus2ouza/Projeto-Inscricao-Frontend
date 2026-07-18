'use client';

import { AuthUser } from '@/features/auth/types/userTypes';
import RegisterPaymentPix from '@/features/payments/components/registerPayment/RegisterPaymentPix';
import PageContainer from '@/shared/components/layout/PageContainer';
import { useSession } from 'next-auth/react';
import { useParams, useSearchParams } from 'next/navigation';

export default function RegisterPaymentPixPage() {
  const { data: session, status } = useSession();

  const params = useParams();
  const searchParams = useSearchParams();

  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const inscriptionsParam = searchParams.get('inscriptions');
  const inscriptionIds = inscriptionsParam
    ? inscriptionsParam.split(',').filter(Boolean)
    : [];

  const remainingValueParam = searchParams.get('remainingValue');
  const remainingValue = remainingValueParam ? Number(remainingValueParam) : 0;

  if (status === 'loading') {
    return <div>Carregando...</div>;
  }

  const user = session?.user as AuthUser | undefined;
  const name = user?.username;
  const email = user?.email;

  const renderContent = () => {
    if (!eventId || !inscriptionIds || !name || !remainingValue) {
      return (
        <div>
          <p>erro de dados</p>
        </div>
      );
    }
    return (
      <RegisterPaymentPix
        eventId={eventId}
        inscriptionIds={inscriptionIds}
        name={name}
        email={email}
        remainingValue={remainingValue}
      />
    );
  };

  return (
    <div className="relative isolate max-h-screen w-full bg-transparent">
      <PageContainer
        title="Pagamento Pix"
        description="Preencha os dados do pagamento e anexe o comprovante"
        maxWidth="full"
        className="bg-transparent"
      >
        {renderContent()}
      </PageContainer>
    </div>
  );
}
