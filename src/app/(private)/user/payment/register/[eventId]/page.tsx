"use client";

import RegisterPaymentTable from "@/features/payment/components/registerPayment/RegisterPayment";
import { useListPaymentPending } from "@/features/payment/hook/registerPayment/useListPaymentPending";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

const PAGE_SIZE = 10;
export default function RegisterPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const {
    inscriptions,
    allowCard,
    total,
    page,
    pageCount,
    loading,
    error,
    setPage,
    refresh,
  } = useListPaymentPending({
    eventId,
    initialPage: 1,
    pageSize: PAGE_SIZE,
  });

  const handleViewPayment = () => {
    router.push(`/user/payment/list-payments/${eventId}`);
  };

  const handleViewPaymentDetails = (paymentId: string) => {
    router.push(`/user/payment/register/${eventId}/${paymentId}`);
  };

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
      <RegisterPaymentTable
        inscriptions={inscriptions}
        allowCard={allowCard}
        total={total}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        pageSize={PAGE_SIZE}
        onViewPayment={handleViewPayment}
        onViewPaymentDetails={handleViewPaymentDetails}
      />
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Registrar Pagamento"
      description="Selecione as inscrições pendentes para realizar o pagamento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
