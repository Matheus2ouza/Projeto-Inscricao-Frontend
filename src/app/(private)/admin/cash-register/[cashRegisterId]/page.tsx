"use client";

import CashRegisterDetails from "@/features/cashRegister/components/cashRegisterDetails/CashRegisterDetetails";
import { useActionsCashRegister } from "@/features/cashRegister/hook/cashRegisterDetails/actions/useActionsCashRegister";
import { useCashRegisterDetails } from "@/features/cashRegister/hook/cashRegisterDetails/useCashRegisterDetails";
import { useCashRegisterMoviments } from "@/features/cashRegister/hook/cashRegisterDetails/useCashRegisterMoviments";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PAGE_SIZE = 10;

export default function CashRegisterDetailsAdminPage() {
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

  const [cashRegisterNumbersLoading, setCashRegisterNumbersLoading] =
    useState(false);
  const [movimentsListLoading, setMovimentsListLoading] = useState(false);

  const {
    handleGenerateReport,
    isGeneratingReport,
    handleFetchFutureReleases,
    futureReleases,
    futureReleasesError,
    isLoadingFutureReleases,
  } = useActionsCashRegister();

  useEffect(() => {
    handleFetchFutureReleases({ cashRegisterId });
  }, [cashRegisterId, handleFetchFutureReleases]);

  const handleBack = () => {
    router.push("/admin/cash-register");
  };

  const handleRefetchCashRegisterNumbers = async () => {
    setCashRegisterNumbersLoading(true);
    try {
      await refetchCashRegister();
    } finally {
      setCashRegisterNumbersLoading(false);
    }
  };

  const handleRefetchMovimentsList = async () => {
    setMovimentsListLoading(true);
    try {
      await refetchMoviments();
    } finally {
      setMovimentsListLoading(false);
    }
  };

  const renderSkeleton = () => {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border bg-white dark:bg-zinc-900 p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-gradient-to-br from-slate-50 to-white dark:from-zinc-950/40 dark:to-zinc-950/10 p-5 shadow-sm"
                >
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="mt-4 h-7 w-40" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-gradient-to-br from-slate-50 to-white dark:from-zinc-950/40 dark:to-zinc-950/10 p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderError = (message: string, onRetry: () => void) => {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center text-destructive">
          <p className="mb-4">{message}</p>
          <Button onClick={onRetry}>Tentar Novamente</Button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const cashRegisterUiLoading = cashRegisterLoading && !cashRegister;
    const movimentsUiLoading = movimentsLoading && !moviments;

    if (cashRegisterUiLoading || movimentsUiLoading) {
      return renderSkeleton();
    }

    if (cashRegisterError && !cashRegister) {
      return renderError(
        `Erro ao carregar detalhes do caixa: ${cashRegisterError}`,
        refetchCashRegister,
      );
    }

    return (
      <CashRegisterDetails
        cashRegister={cashRegister}
        cashRegisterLoading={cashRegisterNumbersLoading}
        cashRegisterFetching={cashRegisterFetching}
        cashRegisterError={cashRegisterError}
        onRefetchCashRegister={handleRefetchCashRegisterNumbers}
        onGenerateReport={() =>
          handleGenerateReport({ cashRegisetrId: cashRegisterId })
        }
        generatingReport={isGeneratingReport}
        moviments={moviments}
        totalMoviments={totalMoviments}
        page={page}
        pageCount={pageCount}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        movimentsLoading={movimentsListLoading}
        movimentsError={movimentsError}
        onRefetchMoviments={handleRefetchMovimentsList}
        onViewMoviment={handleViewMoviment}
        futureReleases={futureReleases}
        futureReleasesLoading={isLoadingFutureReleases}
        futureReleasesError={futureReleasesError}
        onRefetchFutureReleases={() =>
          handleFetchFutureReleases({ cashRegisterId })
        }
      />
    );
  };

  const handleViewMoviment = (movimentId: string) => {
    router.push(`/admin/cash-register/${cashRegisterId}/${movimentId}`);
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
      {renderContent()}
    </PageContainer>
  );
}
