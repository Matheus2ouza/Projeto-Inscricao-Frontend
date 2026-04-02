"use client";

import DetailsInscriptionTable, {
  InscriptionFormFields,
  ParticipantFomrFields,
} from "@/features/inscriptions/components/list-inscriptions/inscription/DetailsInscription";
import useInscriptionReports from "@/features/inscriptions/hooks/actions/reports/useInscriptionsReports";
import { useActionsInscription } from "@/features/inscriptions/hooks/actions/useActionsInscription";
import { useUpdateParticipant } from "@/features/inscriptions/hooks/actions/useUpdateParticipant";
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
    // Atualiza expiração da inscrição
    handleUpdateExpired,
    isUpdatingExpired,

    // Cria o link de pagamento
    handleCreatePaymentLink,
    isCreatingPaymentLink,

    // Deleta a inscrição
    handleDeleteInscription,
    isDeletingInscription,

    // Atualiza os dados da inscrição
    handleUpdateInscription,
    isUpdatingInscription,
  } = useActionsInscription();

  const { handleUpdateParticipant, isUpdatingParticipant } =
    useUpdateParticipant(inscription?.id!);

  const handleSaveInscription = (fields: InscriptionFormFields) =>
    handleUpdateInscription({
      id: inscription!.id,
      responsible: fields.responsible.trim(),
      email: fields.email.trim() || undefined,
      phone: fields.phone.trim() || undefined,
      observation: fields.observation.trim() || undefined,
    });

  const handleSaveParticipant = (fields: ParticipantFomrFields) =>
    handleUpdateParticipant({
      id: fields.id,
      name: fields.name,
      cpf: fields.cpf,
      birthDate: fields.birthDate,
      gender: fields.gender,
      preferredName: fields.preferredName,
      shirtSize: fields.shirtSize,
      shirtType: fields.shirtType,
    });

  const {
    handleGenerateDetailsInscriptionPdfReport,
    isgenerateInscriptionDetailsPdfMutation,
  } = useInscriptionReports();

  const renderSkeletonGrid = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Skeleton className="h-8 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>

            {/* ID e data */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-48" />
            </div>

            {/* Cards de informações */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
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
        onDownloadInscriptionDetailsPdf={(inscriptionId) =>
          handleGenerateDetailsInscriptionPdfReport({ inscriptionId })
        }
        isDownloadingInscriptionDetailsPdf={
          isgenerateInscriptionDetailsPdfMutation
        }
        onSaveInscription={handleSaveInscription}
        isSavingInscription={isUpdatingInscription}
        onDeleteInscription={(id) =>
          handleDeleteInscription({ eventId, inscriptionId: id })
        }
        isDeletingInscription={isDeletingInscription}
        onSaveParticipant={handleSaveParticipant}
        isSavingParticipants={isUpdatingParticipant}
      />
    );
  };

  const handlerViewPayment = (paymentId: string) => {
    router.push(
      `/super/payments/list-payments/${eventId}/details/${paymentId}`,
    );
  };

  const handleBack = () => {
    router.replace(`/super/inscriptions/list-inscriptions/${eventId}`);
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
