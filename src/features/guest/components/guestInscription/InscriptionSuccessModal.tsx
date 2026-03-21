"use client";

import {
  InscriptionStatus,
  RegisterGuestInscriptionResponse,
} from "@/features/guest/types/guestInscription/guestInscriptionTypes";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { Check, Clock, Copy } from "lucide-react";
import { useState } from "react";

interface InscriptionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewInscription: () => void;
  successData: RegisterGuestInscriptionResponse | null;
  paymentCountdownSeconds: number | null;
}

export function InscriptionSuccessModal({
  isOpen,
  onClose,
  onViewInscription,
  successData,
  paymentCountdownSeconds,
}: InscriptionSuccessModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !successData) return null;

  const formatCountdown = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(successData.confirmationCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay com blur sutil */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-in fade-in-0 zoom-in-95">
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
          {/* Botão de fechar no canto superior direito */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            aria-label="Fechar modal"
          >
            <svg
              className="h-4 w-4 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Header */}
          <div className="p-8 pt-12 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              {successData.status === InscriptionStatus.UNDER_REVIEW
                ? "Em Análise"
                : "Inscrição Reservada"}
            </h3>

            <p className="text-gray-500 dark:text-gray-400">
              {successData.status === InscriptionStatus.UNDER_REVIEW
                ? "Sua inscrição entrou em analise, aguarde o retorno dos organizadores."
                : "Sua inscrição foi reservada."}
            </p>
          </div>

          {/* Conteúdo */}
          <div className="px-8 pb-8 space-y-6">
            {successData.status === InscriptionStatus.PENDING &&
              paymentCountdownSeconds !== null && (
                <div className="rounded-xl border border-green-200/70 dark:border-green-800/40 bg-green-50/70 dark:bg-green-900/20 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-800 dark:text-green-200">
                    <Clock className="h-4 w-4" />
                    Tempo restante para pagamento
                  </div>
                  <div className="mt-1 text-center text-3xl font-extrabold tabular-nums text-green-900 dark:text-green-100">
                    {formatCountdown(paymentCountdownSeconds)}
                  </div>
                </div>
              )}

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Código de inscrição
                </span>
                <button
                  onClick={handleCopyCode}
                  className={cn(
                    "text-sm font-medium transition-colors flex items-center gap-1",
                    isCopied
                      ? "text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                      : "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
                  )}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {isCopied ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <div className="font-mono text-xl font-bold tracking-wider text-center py-2 px-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                {successData.confirmationCode}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Este código é único e com ele você pode encontrar sua inscrição
                a qualquer momento.
              </p>
            </div>

            {/* Status e informações */}
            <div className="space-y-4">
              {successData.status === InscriptionStatus.PENDING && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <svg
                        className="h-5 w-5 text-green-600 dark:text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-300">
                        Próximo passo
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        Sua Inscrição foi registrada, para garantir sua
                        participação é necessário realizar o pagamento da sua
                        inscrição dentro de <strong>30 minutos</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {successData.status === InscriptionStatus.UNDER_REVIEW && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <svg
                        className="h-5 w-5 text-amber-600 dark:text-amber-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        Aguarde a análise
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                        Infelizmente, sua inscrição entrou em análise assim que
                        for validade pelos organizadores receberá um e-mail com
                        o resultado da análise.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botões de ação */}
            <div className="space-y-3 pt-4">
              <div className="flex gap-3">
                <Button onClick={onViewInscription} className="flex-1">
                  {successData.status === InscriptionStatus.PENDING
                    ? "Seguir para Pagamento"
                    : "Visualizar Inscrição"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
