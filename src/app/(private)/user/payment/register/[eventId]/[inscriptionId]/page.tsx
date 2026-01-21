"use client";

import { RegisterPaymentDetailsTable } from "@/features/payment/components/registerPaymentDetails/registerPaymentDetails";
import { useRegisterPaymentDetails } from "@/features/payment/hook/registerPaymentDetails/registerPaymentDetails";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

const PAGE_SIZE = 10;
export default function RegisterPaymentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const rawInscriptionId = params.inscriptionId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const inscriptionId = Array.isArray(rawInscriptionId)
    ? rawInscriptionId[0]
    : rawInscriptionId;

  if (!inscriptionId) {
    return null;
  }

  const {
    inscription,
    participant,
    payments,
    allowCard,
    totalParticipant,
    totalPayment,
    page,
    pageCount,
    loading,
    error,
    setPage,
    refresh,
  } = useRegisterPaymentDetails({
    inscriptionId,
    initialPage: 1,
    pageSize: PAGE_SIZE,
  });

  const renderSkeletonGrid = () => {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-muted/30 rounded-lg border">
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

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center text-destructive">
            <p className="mb-4">
              Erro ao carregar pagamentos pendentes: {error.message}
            </p>
            <Button onClick={refresh}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    return (
      <RegisterPaymentDetailsTable
        inscriptions={inscription}
        participant={participant}
        payments={payments}
        allowCard={allowCard}
        total={totalPayment}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Detalhes do Pagamento"
      description="Visualize os detalhes do pagamento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
