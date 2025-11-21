"use client";

import ExpensesByEvent from "@/features/gastos/components/ExpensesByEvent";
import { useCreateExpense } from "@/features/gastos/hooks/useCreateExpense";
import { useExpensesByEvent } from "@/features/gastos/hooks/useExpensesByEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const PAGE_SIZE = 10;

export default function EventExpensesSuperPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = useMemo(() => {
    const raw = params.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params.id]);

  const [page, setPage] = useState(1);

  if (!eventId) return null;

  const { data: expensesData, isLoading, error, invalidate } = useExpensesByEvent({
    eventId,
    page,
    pageSize: PAGE_SIZE,
  });

  const createExpenseForm = useCreateExpense(eventId);

  const loading = isLoading;
  const errorMessage =
    error instanceof Error ? error : typeof error === "string" ? new Error(error) : null;

  const handleBack = () => {
    router.push("/super/gastos");
  };

  return (
    <PageContainer
      title="Gastos do Evento"
      description="Registre e acompanhe os gastos associados ao evento."
      showBackButton
      backButtonAction={handleBack}
    >
      <ExpensesByEvent
        expensesData={expensesData ?? null}
        isLoading={loading}
        error={errorMessage}
        page={page}
        pageSize={PAGE_SIZE}
        pageCount={expensesData?.pageCount ?? 0}
        onPageChange={(newPage) => setPage(newPage)}
        createForm={createExpenseForm}
      />
    </PageContainer>
  );
}
