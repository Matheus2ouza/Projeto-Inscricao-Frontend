'use client';

import ListPayments from '@/features/payments/components/userListPayment/ListPayments';
import { useListPayment } from '@/features/payments/hooks/listPayment/useListPayment';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';
import { FileText, RefreshCw } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

const PAGE_SIZE = 10;
export default function ListPaymentsPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const {
    payments,
    summary,
    total,
    page,
    pageCount,
    loading,
    fetching,
    fetched,
    error,
    setPage,
    refresh,
  } = useListPayment({
    eventId,
    initialPage: 1,
    pageSize: PAGE_SIZE,
  });

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-muted/30 mb-6 flex flex-col items-start justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  };

  const handleRegisterPayment = () => {
    router.push(`/user/payment/register/${eventId}`);
  };

  const handleViewInscription = (inscriptionId: string) => {
    router.push(
      `/user/inscription/my-inscriptions/${eventId}/${inscriptionId}`,
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
              Erro ao carregar histórico de pagamentos: {error.message}
            </p>
            <Button onClick={refresh}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    if (payments.length === 0) {
      return (
        <div className="px-4 py-12">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
                <FileText className="text-muted-foreground h-10 w-10" />
              </div>
            </div>

            <h3 className="mb-2 text-xl font-semibold">
              Nenhum pagamento registrado
            </h3>

            <p className="text-muted-foreground mb-6">
              Não foram encontrados pagamentos para este evento.
              <br />
              Os pagamentos aparecerão aqui quando forem realizados.
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                onClick={handleRegisterPayment}
                variant="default"
                className="gap-2"
              >
                Registrar Pagamento
              </Button>

              <Button
                variant="outline"
                onClick={refresh}
                className="gap-2"
                disabled={fetching}
              >
                <RefreshCw
                  className={cn('h-4 w-4', fetching && 'animate-spin')}
                />
                {fetching ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <ListPayments
        summary={summary}
        payments={payments}
        total={total}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onViewInscription={handleViewInscription}
      />
    );
  };

  const handleBack = () => {
    router.replace(`/user/home`);
  };

  return (
    <PageContainer
      title="Histórico de Pagamentos"
      description="Visualize o histórico de pagamentos realizados"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
