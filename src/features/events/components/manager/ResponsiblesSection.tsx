'use client';

import ResponsiblesDialog from '@/features/accounts/components/responsiblesDialog/ResponsiblesDialog';
import { useAccount } from '@/features/accounts/hooks/listAccountsCombobox/uselistAccountsCombobox';
import { useFormEditEvent } from '@/features/events/hooks/manager/useFormEditEvent';
import { useEventResponsible } from '@/features/events/hooks/useEventResponsible';
import { Event } from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';
import { ConfirmationDialog } from '@/shared/components/ConfirmationDialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { MapPin, Plus, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ResponsiblesSectionProps {
  event: Event;
  responsibleIds: string[];
  refreshEvent: () => void;
}

export function ResponsiblesSection({
  event,
  responsibleIds,
  refreshEvent,
}: ResponsiblesSectionProps) {
  const { isEditing, handleResponsiblesChange } = useFormEditEvent(event);
  const { accounts } = useAccount(isEditing);
  const { remove: removeResponsible, loading: removingResponsible } =
    useEventResponsible();

  const [responsiblesDialogOpen, setResponsiblesDialogOpen] = useState(false);
  const [deleteResponsibleDialog, setDeleteResponsibleDialog] = useState<{
    open: boolean;
    responsibleId: string | null;
    responsibleName: string | null;
  }>({
    open: false,
    responsibleId: null,
    responsibleName: null,
  });

  // Durante edição, mostrar todos os responsáveis selecionados (originais + novos)
  // No modo visualização, mostrar apenas os responsáveis do evento
  const displayResponsibles = isEditing
    ? responsibleIds
        .map((id) => {
          // Tentar encontrar no evento primeiro
          const eventResponsible = event.responsibles?.find((r) => r.id === id);
          if (eventResponsible) {
            return eventResponsible;
          }
          // Se não encontrar, buscar nas accounts (novo responsável)
          const account = accounts.find((acc) => acc.id === id);
          if (account) {
            return {
              id: account.id,
              name: account.username,
            };
          }
          return null;
        })
        .filter((r): r is { id: string; name: string } => r !== null)
    : event.responsibles || [];

  const handleRemoveResponsible = (responsibleId: string, name: string) => {
    // Verificar se é o último responsável
    if (displayResponsibles.length === 1) {
      toast.error('Impossível remover o responsável', {
        description: 'O evento deve ter pelo menos um responsável.',
      });
      return;
    }
    setDeleteResponsibleDialog({
      open: true,
      responsibleId,
      responsibleName: name,
    });
  };

  const handleConfirmDeleteResponsible = async () => {
    if (!deleteResponsibleDialog.responsibleId) return;

    await removeResponsible(
      event.id,
      deleteResponsibleDialog.responsibleId,
      () => {
        // Callback de sucesso: recarregar e atualizar lista local
        refreshEvent();
        handleResponsiblesChange(
          responsibleIds.filter(
            (id) => id !== deleteResponsibleDialog.responsibleId,
          ),
        );
        setDeleteResponsibleDialog({
          open: false,
          responsibleId: null,
          responsibleName: null,
        });
      },
    );
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200/80 bg-white/95 p-6 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Responsáveis
          </h2>
          <div className="flex items-center gap-3">
            {event.regionName && (
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {event.regionName}
              </Badge>
            )}
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setResponsiblesDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Responsável
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {displayResponsibles.length > 0 ? (
            <div className="space-y-2">
              {displayResponsibles.map((responsible) => (
                <div
                  key={responsible.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200/60 bg-gray-50/80 p-3 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex flex-1 items-center gap-2">
                    <UserCheck className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {responsible.name}
                    </span>
                  </div>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleRemoveResponsible(
                          responsible.id,
                          responsible.name,
                        )
                      }
                      disabled={removingResponsible}
                      className="h-8 px-3 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                    >
                      Remover
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <UserCheck className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                Nenhum responsável atribuído
              </p>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 flex items-center gap-2"
                  onClick={() => setResponsiblesDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Responsável
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Diálogo para gerenciar responsáveis */}
      {isEditing && (
        <ResponsiblesDialog
          open={responsiblesDialogOpen}
          onOpenChange={setResponsiblesDialogOpen}
          selectedResponsibleIds={responsibleIds}
          onAddResponsible={(responsibleId) => {
            if (!responsibleIds.includes(responsibleId)) {
              handleResponsiblesChange([...responsibleIds, responsibleId]);
            }
          }}
        />
      )}

      {/* Diálogo de confirmação para excluir responsável */}
      <ConfirmationDialog
        open={deleteResponsibleDialog.open}
        onOpenChange={(open) => {
          setDeleteResponsibleDialog({
            open,
            responsibleId: null,
            responsibleName: null,
          });
        }}
        onConfirm={handleConfirmDeleteResponsible}
        title="Excluir Responsável"
        message={`Tem certeza que deseja remover o responsável "${deleteResponsibleDialog.responsibleName}" deste evento?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        isLoading={removingResponsible}
      />
    </>
  );
}
