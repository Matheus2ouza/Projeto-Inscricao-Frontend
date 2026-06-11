'use client';

import DetailsExpense from '@/features/expenses/components/detailsExpense/DetailsExpense';
import { useActionsExpense } from '@/features/expenses/hooks/actions/useActionsExpense';
import { useDetailsExpense } from '@/features/expenses/hooks/detailsExpense/useDetailsExpense';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

export default function DetailsExpenseAdminPage() {
  const params = useParams();
  const router = useRouter();

  // pega o id do evento
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const rawExpenseId = params.expenseId;
  const expenseId = Array.isArray(rawExpenseId)
    ? rawExpenseId[0]
    : rawExpenseId;

  const { expense, loading, fetched, fetching, error, refresh } =
    useDetailsExpense({
      expenseId,
    });

  const {
    // função para atualizar o gasto
    updateExpense,

    // função para atualizar o comprovante
    updateReceipt,

    // função para deletar o gasto
    deleteExpense,

    // função para deletar o comprovante
    deleteReceipt,
  } = useActionsExpense();

  const handleDeleteExpense = async (expenseId: string) => {
    await deleteExpense.execute(expenseId);
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              className="overflow-hidden rounded-xl border-0 shadow-sm"
            >
              <CardContent className="space-y-3 p-4">
                <div className="relative">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="absolute top-0 right-0 h-6 w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error || expense === null) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <div>
            <p className="font-semibold text-red-600 dark:text-red-400">
              Não foi possível retornar os detalhes deste gasto.
            </p>
            <p className="text-muted-foreground mt-1 max-w-md">
              {error || 'Tente novamente em instantes.'}
            </p>
          </div>
          <Button onClick={() => refresh()} variant="outline">
            Tentar novamente
          </Button>
        </div>
      );
    }

    return (
      <DetailsExpense
        expense={expense}
        updateExpense={updateExpense}
        updateReceipt={updateReceipt}
        deleteExpense={{
          execute: handleDeleteExpense,
          loading: deleteExpense.loading,
        }}
        deleteReceipt={deleteReceipt}
      />
    );
  };

  return (
    <PageContainer
      title="Detalhes do gasto"
      description="Abaixo verá os detalhes do gasto selecionado"
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
