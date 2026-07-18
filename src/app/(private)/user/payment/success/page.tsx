'use client';

import SuccessPayment from '@/features/guest/components/success-payment/SuccessPayment';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const eventId = searchParams.get('eventId') ?? '';
  const clientName = searchParams.get('clientName') ?? '';

  const handleViewInscription = () => {
    router.push(`/user/payment/register/${eventId}`);
  };

  return (
    <SuccessPayment
      buttonText={'Fazer novo pagamento'}
      clientName={clientName}
      onViewInscription={handleViewInscription}
    />
  );
}
