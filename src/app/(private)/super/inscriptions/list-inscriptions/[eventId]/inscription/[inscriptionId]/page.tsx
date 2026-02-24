"use client";

import DetailsInscriptionTable from "@/features/inscriptions/components/list-inscriptions/inscription/DetailsInscription";
import { useActionsInscription } from "@/features/inscriptions/hooks/list-inscriptions/actions/useActionsInscription";
import { useDetailsInscription } from "@/features/inscriptions/hooks/list-inscriptions/inscription/useDetailsInscription";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

export default function InscriptionDetailListSuperPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const rawInscriptionId = params.inscriptionId;
  const inscriptionId = Array.isArray(rawInscriptionId)
    ? rawInscriptionId[0]
    : rawInscriptionId;

  if (!eventId || !inscriptionId) {
    return null;
  }
  const {
    inscription,
    participants,
    payments,
    paymentLink,
    loading,
    error,
    refetch,
  } = useDetailsInscription({ inscriptionId });

  const {
    handleUpdateExpired,
    isUpdatingExpired,
    handleCreatePaymentLink,
    isCreatingPaymentLink,
  } = useActionsInscription();

  const renderSkeletonGrid = () => {
    return (
      <div className="grid grid-cols-1 gap-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <div>
          <p className="text-red-600 dark:text-red-400 font-semibold">
            Não foi possível carregar os eventos.
          </p>
          <p className="text-muted-foreground mt-1 max-w-md">
            {error.message || "Tente novamente em instantes."}
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          Tentar novamente
        </Button>
      </div>;
    }

    return (
      <DetailsInscriptionTable
        inscription={inscription}
        participants={participants}
        payments={payments}
        paymentLink={paymentLink}
        onViewPayment={handlerViewPayment}
        onUpdateExpired={handleUpdateExpired}
        isUpdatingExpired={isUpdatingExpired}
        onCreatePaymentLink={handleCreatePaymentLink}
        isCreatingPaymentLink={isCreatingPaymentLink}
      />
    );
  };

  const handlerViewPayment = (paymentId: string) => {
    router.push(
      `/super/payments/list-payments/${eventId}/details/${paymentId}`,
    );
  };

  const handleBack = () => {
    router.push(`/super/inscriptions/list-inscriptions/${eventId}`);
  };

  return (
    <PageContainer
      title="Detalhes da Inscrição"
      description={
        loading
          ? "Carregando..."
          : inscription?.responsible || "Detalhes da inscrição"
      }
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
