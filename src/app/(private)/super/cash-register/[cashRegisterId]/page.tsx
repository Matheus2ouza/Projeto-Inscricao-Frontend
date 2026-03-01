"use client";

import CashRegisterDetails from "@/features/cashRegister/components/cashRegisterDetails/CashRegisterDetetails";
import { useCashRegisterDetails } from "@/features/cashRegister/hook/cashRegisterDetails/useCashRegisterDetails";
import { useCashRegisterMoviments } from "@/features/cashRegister/hook/cashRegisterDetails/useCashRegisterMoviments";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useParams, useRouter } from "next/navigation";

const PAGE_SIZE = 10;

export default function CashRegisterDetailsSuperdminPage() {
  const params = useParams();
  const router = useRouter();

  const rawCashRegisterId = params.cashRegisterId;
  const cashRegisterId = Array.isArray(rawCashRegisterId)
    ? rawCashRegisterId[0]
    : rawCashRegisterId;

  if (!cashRegisterId) {
    return null;
  }

  const {
    cashRegisters: cashRegister,
    loading: cashRegisterLoading,
    fetching: cashRegisterFetching,
    error: cashRegisterError,
    refetch: refetchCashRegister,
  } = useCashRegisterDetails({
    cashRegisterId,
  });

  const {
    moviments,
    totalMoviments,
    totalIncome,
    totalExpense,
    page,
    pageCount,
    setPage,
    loading: movimentsLoading,
    fetching: movimentsFetching,
    error: movimentsError,
    refetch: refetchMoviments,
  } = useCashRegisterMoviments({
    cashRegisterId,
    type: undefined,
    limitTime: undefined,
    orderBy: "desc",
    initialPage: 1,
    pageSize: PAGE_SIZE,
  });

  const handleBack = () => {
    router.push("/super/cash-register");
  };

  return (
    <PageContainer
      title="Detalhes do Caixa"
      description={
        cashRegisterLoading ? "Carregando..." : cashRegister?.name || "Caixa"
      }
      showBackButton
      backButtonAction={handleBack}
    >
      <CashRegisterDetails
        cashRegister={cashRegister}
        cashRegisterLoading={cashRegisterLoading}
        cashRegisterFetching={cashRegisterFetching}
        cashRegisterError={cashRegisterError}
        onRefetchCashRegister={refetchCashRegister}
        moviments={moviments}
        totalMoviments={totalMoviments}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        movimentsLoading={movimentsLoading}
        movimentsFetching={movimentsFetching}
        movimentsError={movimentsError}
        onRefetchMoviments={refetchMoviments}
      />
    </PageContainer>
  );
}
