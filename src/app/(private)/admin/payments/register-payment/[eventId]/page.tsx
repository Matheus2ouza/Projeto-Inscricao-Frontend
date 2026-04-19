'use client';
import RegisterPayment from '@/features/payments/components/adminRegisterPayment/RegisterPayment';
import { useListInscriptionsPending } from '@/features/payments/hooks/adminRegisterPayment/listInscriptionsPending';
import { useRegisterPayment } from '@/features/payments/hooks/adminRegisterPayment/registerPayment';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

export default function RegisterPaymentAdminPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const { inscriptions, loading, fetching, error, refresh } =
    useListInscriptionsPending({
      eventId,
    });

  const { registerPayment, isRegisteringPayment } = useRegisterPayment();

  const handleBack = () => {
    router.push(`/admin/payments/register-payment`);
  };

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <div className="space-y-2 rounded-xl border p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <div className="flex min-h-96 items-center justify-center p-6">
          <div className="text-destructive text-center">
            <p className="mb-4">
              Erro ao tentar trazer as inscrições: {error.message}
            </p>
            <Button onClick={refresh}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    return (
      <RegisterPayment
        listInscriptions={inscriptions}
        loading={loading || fetching}
        registerPayment={registerPayment}
        isRegisteringPayment={isRegisteringPayment}
      />
    );
  };

  return (
    <PageContainer
      title="Lista de Comprovantes"
      description="Lista de Comprovantes referentes as Inscrições"
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
