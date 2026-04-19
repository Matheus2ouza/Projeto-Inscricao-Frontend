'use client';

import ListReceipts from '@/features/payments/components/list-receipts/ListReceipts';
import { useListReceipts } from '@/features/payments/hooks/list-receipts/useListReceipts';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

export default function ListReceiptsAdminPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const { receipts, total, page, pageCount, loading, error, setPage, refresh } =
    useListReceipts({
      eventId,
      initialPage: 1,
      pageSize: 10,
    });

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
              Erro ao carregar os comprovantes: {error.message}
            </p>
            <Button onClick={refresh}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    return (
      <ListReceipts
        receipts={receipts}
        total={total}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    );
  };

  const handleBack = () => {
    router.push('/admin/payments/list-receipts');
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
