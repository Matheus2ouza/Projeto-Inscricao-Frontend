'use client';

import { useEventManagerMutations } from '@/features/events/hooks/manager/useEventManagerMutations';
import { InscriptionMode } from '@/features/events/types/manager/eventManagerTypes';
import { Button } from '@/shared/components/ui/button';
import { Plus, User, X } from 'lucide-react';
import { useState } from 'react';

interface InscriptionModesManagerProps {
  eventId: string;
  selectedModes: InscriptionMode[];
}

// Opções para os modos de inscrição
const inscriptionModeOptions: { value: InscriptionMode; label: string }[] = [
  { value: InscriptionMode.NORMAL, label: 'Normal' },
  { value: InscriptionMode.GUEST, label: 'Não Alocados' },
];

export default function InscriptionModesManager({
  eventId,
  selectedModes,
}: InscriptionModesManagerProps) {
  const [localSelectedModes, setLocalSelectedModes] =
    useState<InscriptionMode[]>(selectedModes);

  // Usar o mutation do hook
  const { handleUpdateInscriptionMode, isUpdatingInscriptionMode } =
    useEventManagerMutations(eventId);

  // Função para adicionar um modo de inscrição
  const handleAddMode = async (mode: InscriptionMode) => {
    const newModes = [...localSelectedModes, mode];
    setLocalSelectedModes(newModes);

    try {
      await handleUpdateInscriptionMode({
        eventId,
        inscriptionMode: newModes,
      });
    } catch (error) {
      // Em caso de erro, reverte para os modos originais
      setLocalSelectedModes(selectedModes);
    }
  };

  // Função para remover um modo de inscrição
  const handleRemoveMode = async (mode: InscriptionMode) => {
    const newModes = localSelectedModes.filter((m) => m !== mode);
    setLocalSelectedModes(newModes);

    try {
      await handleUpdateInscriptionMode({
        eventId,
        inscriptionMode: newModes,
      });
    } catch (error) {
      // Em caso de erro, reverte para os modos originais
      setLocalSelectedModes(selectedModes);
    }
  };

  return (
    <div className="space-y-4">
      {/* Lista de modos de inscrição */}
      <div className="space-y-2">
        {(() => {
          // Mostra todos os modos disponíveis
          const allModes = inscriptionModeOptions;

          if (allModes.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <User className="mx-auto mb-2 h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nenhum modo de inscrição disponível
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
                  <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
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
                    disabled={isUpdatingInscriptionMode}
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
                    disabled={isUpdatingInscriptionMode}
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
