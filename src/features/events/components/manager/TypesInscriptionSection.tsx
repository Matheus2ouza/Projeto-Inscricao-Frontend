'use client';

import TypeInscriptionDialog from '@/features/typeInscription/components/TypeInscriptionDialog';
import { useTypeInscriptionsMutations } from '@/features/typeInscription/hook/useTypeInscriptionsMutations';
import { TypeInscription } from '@/features/typeInscription/types/listTypeInscriptionsToManager/listTypeInscriptionsManagerTypes';
import { ConfirmationDialog } from '@/shared/components/ConfirmationDialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { calculateMaxAge } from '@/shared/utils/calculateMaxAge';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { Plus, Tag } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useInvalidateEventDetailsManagerQuery } from '../../hooks/manager/eventDetailsManager/useEventDetailsManagerQuery';

interface TypesInscriptionSectionProps {
  eventId: string;
  eventStartDate: string;
  typeInscriptions: TypeInscription[] | null;
  isEditing: boolean;
  refreshEvent: () => void;
  refreshTypeInscriptions: () => void;
}

export function TypesInscriptionSection({
  eventId,
  eventStartDate,
  typeInscriptions,
  isEditing,
  refreshEvent,
  refreshTypeInscriptions,
}: TypesInscriptionSectionProps) {
  const { invalidateDetail } = useInvalidateEventDetailsManagerQuery();

  // Mutations
  const {
    handleCreateTypeInscription,
    isCreatingTypeInscription,
    handleUpdateTypeInscription,
    isUpdatingTypeInscription,
    handleDeleteTypeInscription,
    isDeletingTypeInscription,
    handleDisableTypeInscription,
    isDisablingTypeInscription,
  } = useTypeInscriptionsMutations(eventId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentType, setCurrentType] = useState<TypeInscription | null>(null);
  const dialogScrollPositionRef = useRef(0);

  const [deleteTypeDialog, setDeleteTypeDialog] = useState<{
    open: boolean;
    type: TypeInscription | null;
  }>({
    open: false,
    type: null,
  });

  const [disableTypeDialog, setDisableTypeDialog] = useState<{
    open: boolean;
    type: TypeInscription | null;
  }>({
    open: false,
    type: null,
  });

  const typeInscriptionLoading =
    isCreatingTypeInscription ||
    isUpdatingTypeInscription ||
    isDeletingTypeInscription ||
    isDisablingTypeInscription;

  const typesInscriptions = typeInscriptions ?? [];
  const hasTypeInscriptions = typesInscriptions.length > 0;

  // Funções para gerenciar tipos de inscrição
  const handleCreateType = () => {
    dialogScrollPositionRef.current =
      typeof window !== 'undefined' ? window.scrollY : 0;
    setCurrentType(null);
    setDialogOpen(true);
    requestAnimationFrame(() => {
      if (typeof window !== 'undefined') {
        window.scrollTo({
          top: dialogScrollPositionRef.current,
          behavior: 'auto',
        });
      }
    });
  };

  const handleEditType = (type: TypeInscription) => {
    dialogScrollPositionRef.current =
      typeof window !== 'undefined' ? window.scrollY : 0;
    setCurrentType(type);
    setDialogOpen(true);
    requestAnimationFrame(() => {
      if (typeof window !== 'undefined') {
        window.scrollTo({
          top: dialogScrollPositionRef.current,
          behavior: 'auto',
        });
      }
    });
  };

  const handleDeleteType = (type: TypeInscription) => {
    setDeleteTypeDialog({ open: true, type });
  };

  const handleDisableType = (type: TypeInscription) => {
    setDisableTypeDialog({ open: true, type });
  };

  const handleSubmitType = async (data: {
    description: string;
    value: number;
    specialType: boolean;
    rule: number | null;
    participantLimit: number;
    limitIsStrict: boolean;
  }) => {
    try {
      const payload = {
        ...data,
      };
      if (currentType) {
        // Edição
        await handleUpdateTypeInscription({
          typeInscriptionId: currentType.id,
          input: payload,
        });
      } else {
        // Criação
        await handleCreateTypeInscription({ ...data, eventId });
      }
      // Invalidar cache do evento para recarregar os tipos de inscrição
      invalidateDetail(eventId);
      refreshTypeInscriptions();
      refreshEvent();
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleConfirmDeleteType = useCallback(async () => {
    if (!deleteTypeDialog.type) return;

    try {
      await handleDeleteTypeInscription(deleteTypeDialog.type.id);
      invalidateDetail(eventId);
      await refreshTypeInscriptions();
      await refreshEvent();
      setDeleteTypeDialog({ open: false, type: null });
    } catch (error) {
      // Erro já tratado no hook
    }
  }, [
    deleteTypeDialog.type,
    eventId,
    invalidateDetail,
    handleDeleteTypeInscription,
    refreshEvent,
    refreshTypeInscriptions,
  ]);

  const handleConfirmDisableType = useCallback(async () => {
    if (!disableTypeDialog.type) return;

    try {
      await handleDisableTypeInscription({
        typeInscriptionId: disableTypeDialog.type.id,
        active: !disableTypeDialog.type.active,
      });
      invalidateDetail(eventId);
      await refreshTypeInscriptions();
      await refreshEvent();
      setDisableTypeDialog({ open: false, type: null });
    } catch (error) {
      // Erro já tratado no hook
    }
  }, [
    disableTypeDialog.type,
    eventId,
    invalidateDetail,
    handleDisableTypeInscription,
    refreshEvent,
    refreshTypeInscriptions,
  ]);

  return (
    <>
      <div className="rounded-xl border border-gray-200/80 bg-white/95 p-6 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Tipos de Inscrição
          </h2>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {typesInscriptions.length} tipos
            </Badge>
            {isEditing && (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleCreateType}
              >
                <Plus className="h-4 w-4" />
                Adicionar Novo Tipo
              </Button>
            )}
          </div>
        </div>

        {!hasTypeInscriptions ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Tag className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              Nenhum tipo de inscrição configurado
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Adicione tipos de inscrição para permitir que participantes se
              inscrevam no evento.
            </p>
            <Button
              className="flex items-center gap-2"
              onClick={handleCreateType}
            >
              <Plus className="h-4 w-4" />
              Adicionar Primeiro Tipo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {typesInscriptions.map((type) => {
              const isTypeActive = type.active !== false;

              return (
                <div
                  key={type.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200/60 bg-gray-50/80 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-medium text-gray-900 uppercase dark:text-white">
                        {type.description}
                      </h4>
                      <Badge
                        className={
                          isTypeActive
                            ? 'bg-emerald-600 text-xs text-white hover:bg-emerald-600'
                            : 'text-xs'
                        }
                        variant={isTypeActive ? 'default' : 'destructive'}
                      >
                        {isTypeActive ? 'Ativo' : 'Desabilitado'}
                      </Badge>
                      {type.specialType && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 text-xs tracking-wide uppercase"
                        >
                          Especial
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getFormatCurrency(type.value)} •{' '}
                      {calculateMaxAge({
                        ruleDate: type.rule,
                        baseDate: eventStartDate,
                      })}
                    </p>
                  </div>
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditType(type)}
                        disabled={typeInscriptionLoading}
                      >
                        Editar
                      </Button>
                      <Button
                        variant={isTypeActive ? 'outline' : 'default'}
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleDisableType(type)}
                        disabled={typeInscriptionLoading}
                      >
                        {isTypeActive ? 'Desabilitar' : 'Ativar'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteType(type)}
                        disabled={typeInscriptionLoading}
                      >
                        Excluir
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Diálogo para tipos de inscrição */}
      <TypeInscriptionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        typeInscription={currentType}
        eventId={eventId}
        eventStartDate={eventStartDate}
        onSubmit={handleSubmitType}
        loading={typeInscriptionLoading}
      />

      {/* Diálogo de confirmação para excluir tipo */}
      <ConfirmationDialog
        open={deleteTypeDialog.open}
        onOpenChange={(open) => {
          setDeleteTypeDialog({
            open,
            type: open ? deleteTypeDialog.type : null,
          });
        }}
        onConfirm={handleConfirmDeleteType}
        title="Excluir tipo de inscrição?"
        message={`Tem certeza que deseja excluir o tipo "${deleteTypeDialog.type?.description ?? ''}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir tipo"
        cancelText="Cancelar"
        isLoading={isDeletingTypeInscription}
        variant="destructive"
      />

      {/* Diálogo de confirmação para ativar/desativar tipo */}
      <ConfirmationDialog
        open={disableTypeDialog.open}
        onOpenChange={(open) => {
          setDisableTypeDialog({
            open,
            type: open ? disableTypeDialog.type : null,
          });
        }}
        onConfirm={handleConfirmDisableType}
        title={
          disableTypeDialog.type?.active
            ? 'Desabilitar tipo de inscrição?'
            : 'Ativar tipo de inscrição?'
        }
        message={`Tem certeza que deseja ${
          disableTypeDialog.type?.active ? 'desabilitar' : 'ativar'
        } o tipo "${disableTypeDialog.type?.description ?? ''}"?`}
        confirmText={disableTypeDialog.type?.active ? 'Desabilitar' : 'Ativar'}
        cancelText="Cancelar"
        isLoading={isDisablingTypeInscription}
        variant="default"
      />
    </>
  );
}
