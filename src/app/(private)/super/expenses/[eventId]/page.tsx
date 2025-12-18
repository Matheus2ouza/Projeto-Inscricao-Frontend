"use client";

import ExpensesByEvent from "@/features/gastos/components/ExpensesByEvent";
import { useCreateExpense } from "@/features/gastos/hooks/create/useCreateExpense";
import { useExpensesByEvent } from "@/features/gastos/hooks/useExpensesByEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function EventExpensesSuperPage() {
  const [page, setPage] = useState(1);
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) return null;

  const {
    data: expensesData,
    isLoading,
    error,
  } = useExpensesByEvent({
    eventId,
    page,
    pageSize: 10,
  });

  const createExpenseForm = useCreateExpense(eventId);

  const loading = isLoading;
  const errorMessage =
    error instanceof Error
      ? error
      : typeof error === "string"
        ? new Error(error)
        : null;

  const handleBack = () => {
    router.push("/admin/expenses");
  };

  const renderSkeletonGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-0">
              <Skeleton className="w-full h-48 rounded-t-xl" />
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      renderSkeletonGrid();
    }

    if (error) {
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 text-center text-red-600">
          {error instanceof Error ? error.message : error}
        </CardContent>
      </Card>;
    }

    return (
      <ExpensesByEvent
        expensesData={expensesData ?? null}
        isLoading={loading}
        error={errorMessage}
        page={page}
        pageSize={10}
        pageCount={expensesData?.pageCount ?? 0}
        onPageChange={(newPage) => setPage(newPage)}
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
