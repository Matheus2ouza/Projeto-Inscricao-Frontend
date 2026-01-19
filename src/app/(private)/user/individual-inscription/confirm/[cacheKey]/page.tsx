"use client";

import IndividualInscriptionConfirmation from "@/features/inscriptionIndiv/components/IndivInscriptionConfirmation";
import { IndividualPaymentConfirmation } from "@/features/inscriptionIndiv/components/IndivPaymentConfirmation";
import { useIndividualInscriptionConfirmation } from "@/features/inscriptionIndiv/hooks/useIndividualInscriptionConfirmation";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function IndividualInscriptionConfirmPage() {
  const params = useParams();
  const cacheKey = params.cacheKey as string;

  const {
    confirmationData,
    confirmationResult,
    confirming,
    cancelling,
    error,
    timeRemaining,
    handleConfirm,
    handleCancel,
    handlePayment,
    handleSkipPayment,
  } = useIndividualInscriptionConfirmation(cacheKey);

  if (error || (!confirmationData && !confirmationResult)) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowLeft className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Dados não encontrados
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Os dados da inscrição não foram encontrados ou expiraram.
            </p>
            <Button onClick={() => window.history.back()}>Voltar</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {confirmationResult
              ? "Inscrição Confirmada"
              : "Confirmar Inscrição"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {confirmationResult
              ? "Sua inscrição individual foi realizada com sucesso"
              : "Revise os dados antes de confirmar a inscrição individual"}
          </p>
        </div>
      </div>

      {confirmationResult ? (
        <>
          <IndividualPaymentConfirmation
            inscriptionId={confirmationResult.inscriptionId}
            paymentEnabled={confirmationResult.paymentEnabled}
            inscriptionStatus={confirmationResult.inscriptionStatus}
            onPayment={handlePayment}
            onSkipPayment={handleSkipPayment}
          />
        </>
      ) : (
        <>
          <IndividualInscriptionConfirmation
            cacheKey={cacheKey}
            confirmationData={confirmationData}
            confirming={confirming}
            cancelling={cancelling}
            timeRemaining={timeRemaining}
            handleConfirm={handleConfirm}
            handleCancel={handleCancel}
          />
        </>
      )}
    </div>
  );
}
