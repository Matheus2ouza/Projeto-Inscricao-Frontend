'use client';

import ListExpenses from '@/features/expenses/components/listExpense/ListExpenses';
import { useCreateExpense } from '@/features/expenses/hooks/create/useCreateExpense';
import { useListExpense } from '@/features/expenses/hooks/listExpenses/useListExpenses';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

export default function ListExpensesSuperPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const { expense, total, loading, error, page, pageCount, setPage } =
    useListExpense({
      eventId,
      initialPage: 1,
      pageSize: 12,
    });

  const createExpenseForm = useCreateExpense(eventId);

  const handleBack = () => {
    router.push('/super/expenses');
  };

  const handleViewDetails = (expenseId: string) => {
    router.push(`/super/expenses/${expenseId}`);
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

    if (error) {
      return (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center text-red-600">
            {error.message}
          </CardContent>
        </Card>
      );
    }

    if (expense.length === 0) {
      return (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-10 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Nenhum gasto registrado
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Registre um gasto para aparecer aqui.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <ListExpenses
        expenses={expense}
        total={total}
        page={page}
        pageSize={10}
        pageCount={pageCount}
        onViewDetails={handleViewDetails}
        onPageChange={setPage}
        createForm={createExpenseForm}
      />
    );
  };

  return (
    <PageContainer
      title="Gastos do Evento"
      description="Registre e acompanhe os gastos associados ao evento."
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
