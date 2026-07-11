'use client';

import { useRegisterPaymentPix } from '@/features/payments/hooks/registerPayment/useRegisterPaymentPix';
import PageContainer from '@/shared/components/layout/PageContainer';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

export default function GuestRegisterPaymentPixPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const totalValueParam = searchParams.get('totalValue');
  const totalValue = Number(totalValueParam ?? 0);
  const resolvedTotalValue = Number.isFinite(totalValue) ? totalValue : 0;

  // Pega inscrições do query string
  const queryCsv = searchParams.get('inscriptions');
  const queryList = queryCsv
    ? queryCsv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const repeatedParams =
    typeof searchParams.getAll === 'function'
      ? searchParams.getAll('inscriptionId')
      : [];

  const inscriptionsIds = Array.from(
    new Set<string>([...queryList, ...repeatedParams]),
  );

  // Pega nome e email do convidado do query string
  const guestNameParam = searchParams.get('guestName');
  const guestName = guestNameParam ?? '';

  const guestEmailParam = searchParams.get('guestEmail');
  const guestEmail = guestEmailParam ?? '';

  const registerPaymentPix = useRegisterPaymentPix();

  const allowCardParam = searchParams.get('allowCard');
  const allowCard = allowCardParam === '1' || allowCardParam === 'true';

  const handleBack = () => {
    router.back();
  };

  const renderContent = () => {
    return (
      // <RegisterPaymentPix
      //   selectedInscriptions={inscriptionsIds.map((id) => ({ id }))}
      //   eventId={eventId}
      //   totalValue={resolvedTotalValue}
      //   allowCard={allowCard}
      //   allowCustomValue={false}
      //   onSubmitPayment={({ value, image }) =>
      //     registerPaymentPix.mutateAsync({
      //       eventId,
      //       guestName,
      //       guestEmail,
      //       isGuest: true,
      //       totalValue: value,
      //       image,
      //       inscriptions: inscriptionsIds.map((id) => ({ id })),
      //     })
      //   }
      // />
      <div>
        <p>aguardando refatoração</p>
      </div>
    );
  };

  return (
    <PageContainer
      title="Registrar Pagamento"
      description="Envie o comprovante do Pix para finalizar o pagamento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
