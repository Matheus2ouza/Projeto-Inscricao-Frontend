'use client';

import {
  InscriptionStatus,
  RegisterGuestInscriptionResponse,
} from '@/features/guest/types/guestInscription/guestInscriptionTypes';
import { cn } from '@/lib/utils';
import { Check, Copy, CreditCard } from 'lucide-react';
import { useState } from 'react';

interface InscriptionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewInscription: () => void;
  successData: RegisterGuestInscriptionResponse | null;
  paymentCountdownSeconds: number | null;
  primaryColor?: string;
}

export function InscriptionSuccessModal({
  isOpen,
  onClose,
  onViewInscription,
  successData,
  paymentCountdownSeconds,
  primaryColor,
}: InscriptionSuccessModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !successData) return null;

  const formatCountdown = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const isUrgent =
    paymentCountdownSeconds !== null && paymentCountdownSeconds <= 300;
  const accentColor = primaryColor || '#d97706';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(successData.confirmationCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isPending = successData.status === InscriptionStatus.PENDING;

  return (
    <div className="fixed inset-0 flex items-end justify-center p-0 sm:items-center sm:p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="animate-in slide-in-from-bottom-4 sm:animate-in sm:fade-in-0 sm:zoom-in-95 relative w-full duration-200 sm:max-w-md">
        <div className="overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl dark:bg-gray-950">
          {/* Alert Banner — só para PENDING */}
          {isPending ? (
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ backgroundColor: accentColor }}
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                <svg
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10 2L2 17h16L10 2z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 9v3M10 13.5v.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-white uppercase">
                  Ação necessária
                </p>
                <p className="text-xs text-white/80">
                  Sua vaga ainda não está confirmada
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-amber-500 px-5 py-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                <svg
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-white uppercase">
                  Em análise
                </p>
                <p className="text-xs text-white/80">
                  Aguarde o retorno dos organizadores
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4 px-5 pt-6 pb-8">
            {/* Warning box — só para PENDING */}
            {isPending && (
              <div className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800/50 dark:bg-amber-900/20">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 6v5M10 13v1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                    Realize o pagamento para garantir sua vaga
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-400">
                    Sua inscrição foi <strong>reservada temporariamente</strong>
                    . Sem o pagamento dentro do prazo, ela será{' '}
                    <strong>cancelada automaticamente</strong> e a vaga liberada
                    para outra pessoa.
                  </p>
                </div>
              </div>
            )}

            {/* Under Review info box */}
            {!isPending && (
              <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/40 dark:bg-amber-900/20">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                    Aguarde a análise
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-400">
                    Assim que validada pelos organizadores, você receberá um
                    e-mail com o resultado.
                  </p>
                </div>
              </div>
            )}

            {/* Countdown — só para PENDING */}
            {isPending && paymentCountdownSeconds !== null && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-block h-2 w-2 rounded-full',
                      isUrgent ? 'animate-pulse bg-red-500' : 'bg-amber-500',
                    )}
                  />
                  <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400">
                    Tempo restante para pagar
                  </span>
                </div>
                <p
                  className={cn(
                    'text-center font-mono text-5xl font-semibold tracking-tight tabular-nums',
                    isUrgent
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-900 dark:text-white',
                  )}
                >
                  {formatCountdown(paymentCountdownSeconds)}
                </p>
                <p className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
                  A reserva expira se o pagamento não for efetuado
                </p>
              </div>
            )}

            {/* Código de inscrição */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400">
                  Código de inscrição
                </span>
                <button
                  onClick={handleCopyCode}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors',
                    isCopied
                      ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700',
                  )}
                >
                  {isCopied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {isCopied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-center font-mono text-xl font-bold tracking-widest text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                {successData.confirmationCode}
              </div>
              <p className="mt-2.5 text-center text-xs leading-relaxed text-gray-400 dark:text-gray-500">
                Guarde este código — com ele você acessa sua inscrição a
                qualquer momento.
              </p>
            </div>

            {/* Botão principal */}
            <button
              onClick={onViewInscription}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]',
                isPending
                  ? ''
                  : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white',
              )}
              style={isPending ? { backgroundColor: accentColor } : undefined}
            >
              {isPending && <CreditCard className="h-4 w-4" />}
              {isPending
                ? 'Pagar agora e confirmar vaga'
                : 'Visualizar inscrição'}
            </button>

            {/* Dismiss */}
            <button
              onClick={onClose}
              className="text w-full py-2 text-sm text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400"
            >
              {isPending ? 'Voltar e pagar depois' : 'Fechar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
