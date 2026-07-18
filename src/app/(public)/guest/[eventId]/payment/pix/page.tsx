'use client';

import RegisterPaymentPixPublic from '@/features/payments/components/registerPaymentPublic/RegisterPaymentPixPublic';
import PageContainer from '@/shared/components/layout/PageContainer';
import { useParams, useSearchParams } from 'next/navigation';

export default function GuestRegisterPaymentPixPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const inscriptionId = searchParams.get('inscriptions');
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const remainingValueParam = searchParams.get('remainingValue');
  const remainingValue = remainingValueParam ? Number(remainingValueParam) : 0;

  if (!eventId || !inscriptionId) {
    return null;
  }

  const renderContent = () => {
    if (!eventId || !inscriptionId || !name || !remainingValue || !email) {
      return (
        <div>
          <p>erro de dados</p>
        </div>
      );
    }
    return (
      <RegisterPaymentPixPublic
        eventId={eventId}
        inscriptionId={inscriptionId}
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
