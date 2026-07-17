'use client';

import { useEventManagerMutations } from '@/features/events/hooks/manager/useEventManagerMutations';
import { PaymentMode } from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';
import { Button } from '@/shared/components/ui/button';
import { CreditCard, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface PaymentModesManagerProps {
  eventId: string;
  selectedModes: PaymentMode[];
}

// Opções para os modos de pagamento
const paymentModeOptions: { value: PaymentMode; label: string }[] = [
  { value: PaymentMode.BOLETO, label: 'Boleto' },
  { value: PaymentMode.PIX, label: 'PIX' },
  { value: PaymentMode.CARTAO, label: 'Cartão' },
];

export default function PaymentModesManager({
  eventId,
  selectedModes,
}: PaymentModesManagerProps) {
  const [localSelectedModes, setLocalSelectedModes] =
    useState<PaymentMode[]>(selectedModes);

  // Usar o mutation do hook
  const { handleUpdatePaymentMode, isUpdatingPaymentMode } =
    useEventManagerMutations(eventId);

  // Função para adicionar um modo de pagamento
  const handleAddMode = async (mode: PaymentMode) => {
    const newModes = [...localSelectedModes, mode];
    setLocalSelectedModes(newModes);

    try {
      await handleUpdatePaymentMode({
        eventId,
        paymentMode: newModes,
      });
    } catch (error) {
      // Em caso de erro, reverte para os modos originais
      setLocalSelectedModes(selectedModes);
    }
  };

  // Função para remover um modo de pagamento
  const handleRemoveMode = async (mode: PaymentMode) => {
    const newModes = localSelectedModes.filter((m) => m !== mode);
    setLocalSelectedModes(newModes);

    try {
      await handleUpdatePaymentMode({
        eventId,
        paymentMode: newModes,
      });
    } catch (error) {
      // Em caso de erro, reverte para os modos originais
      setLocalSelectedModes(selectedModes);
    }
  };

  return (
    <div className="space-y-4">
      {/* Lista de modos de pagamento */}
      <div className="space-y-2">
        {(() => {
          // Mostra todos os modos disponíveis
          const allModes = paymentModeOptions;

          if (allModes.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CreditCard className="mx-auto mb-2 h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nenhum modo de pagamento disponível
                </p>
              </div>
            );
          }

          return allModes.map((option) => {
            const isSelected = localSelectedModes.includes(option.value);

            return (
              <div
                key={option.value}
                className="flex items-center justify-between rounded-lg border border-gray-200/60 bg-gray-50/80 p-3 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex flex-1 items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {option.label}
                  </span>
                </div>
                {isSelected ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                    onClick={() => handleRemoveMode(option.value)}
                    disabled={isUpdatingPaymentMode}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-green-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/20"
                    onClick={() => handleAddMode(option.value)}
                    disabled={isUpdatingPaymentMode}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
