'use client';

import RegisterPaymentPix from '@/features/payments/components/registerPayment/RegisterPaymentPix';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

export default function RegisterPaymentPixPage() {
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

  const allowCardParam = searchParams.get('allowCard');
  const allowCard = allowCardParam === '1' || allowCardParam === 'true';

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Registrar Pagamento"
      description="Envie o comprovante do Pix para finalizar o pagamento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {inscriptionsIds.length === 0 ? (
        <div className="flex min-h-72 items-center justify-center p-6">
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Nenhuma inscrição selecionada para pagamento.
            </p>
            <Button onClick={handleBack}>Voltar</Button>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl">
          <RegisterPaymentPix
            selectedInscriptions={inscriptionsIds.map((id) => ({ id }))}
            eventId={eventId}
            totalValue={resolvedTotalValue}
            allowCard={allowCard}
            allowCustomValue={true}
            onPaymentRegistered={(payment) => {
              // Opcional: fazer algo após o pagamento ser registrado
              // Exemplo: redirecionar para página de sucesso
              // router.push(`/user/payment/success/${payment.id}`);
            }}
          />
        </div>
      )}
    </PageContainer>
  );
}
