'use client';

import { createTypeInscriptionAction } from '@/features/typeInscription/actions/createTypeInscription/createTypeInscriptionAction';
import { deleteTypeInscriptionAction } from '@/features/typeInscription/actions/deleteTypeInscription/deleteTypeInscriptionAction';
import { updateTypeInscriptionAction } from '@/features/typeInscription/actions/updateTypeInscription/updateTypeInscriptionAction';
import { updateTypeInscriptionActiveAction } from '@/features/typeInscription/actions/updateTypeInscriptionActive/updateTypeInscriptionActiveAction';
import type { CreateTypeInscriptionInput } from '@/features/typeInscription/types/createTypeInscription/createTypeInscriptionTypes';
import type { UpdateTypeInscriptionInput } from '@/features/typeInscription/types/updateTypeInscription/updateTypeInscriptionTypes';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useInvalidateListTypeInscriptionsToManagerQuery } from './listTypeInscriptionsToManager/useListTypeInscriptionsToManagerQuery';

export function useTypeInscriptionsMutations(eventId: string) {
  const { invalidateList } = useInvalidateListTypeInscriptionsToManagerQuery();

  // create
  const {
    mutateAsync: createTypeInscriptionMutation,
    isPending: isCreatingTypeInscription,
  } = useMutation({
    mutationFn: (input: CreateTypeInscriptionInput) =>
      createTypeInscriptionAction(input),
    onSuccess: () => {
      invalidateList(eventId);
      toast.success('Tipo de inscrição criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar tipo de inscrição', {
        description: error.message,
      });
    },
  });

  // update
  const {
    mutateAsync: updateTypeInscriptionMutation,
    isPending: isUpdatingTypeInscription,
  } = useMutation({
    mutationFn: ({
      typeInscriptionId,
      input,
    }: {
      typeInscriptionId: string;
      input: UpdateTypeInscriptionInput;
    }) => updateTypeInscriptionAction(typeInscriptionId, input),
    onSuccess: () => {
      invalidateList(eventId);
      toast.success('Tipo de inscrição atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar tipo de inscrição', {
        description: error.message,
      });
    },
  });

  // delete
  const {
    mutateAsync: deleteTypeInscriptionMutation,
    isPending: isDeletingTypeInscription,
  } = useMutation({
    mutationFn: (typeInscriptionId: string) =>
      deleteTypeInscriptionAction({ id: typeInscriptionId }),
    onSuccess: () => {
      invalidateList(eventId);
      toast.success('Tipo de inscrição excluído com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao excluir tipo de inscrição', {
        description: error.message,
      });
    },
  });

  // update active
  const {
    mutateAsync: updateTypeInscriptionActiveMutation,
    isPending: isUpdatingTypeInscriptionActive,
  } = useMutation({
    mutationFn: ({
      typeInscriptionId,
      active,
    }: {
      typeInscriptionId: string;
      active: boolean;
    }) => updateTypeInscriptionActiveAction({ typeInscriptionId, active }),
    onSuccess: (_data, variables) => {
      invalidateList(eventId);
      toast.success(
        variables.active
          ? 'Tipo de inscrição ativado com sucesso!'
          : 'Tipo de inscrição desabilitado com sucesso!',
      );
    },
    onError: (_error, variables) => {
      toast.error(
        variables.active
          ? 'Erro ao ativar tipo de inscrição'
          : 'Erro ao desabilitar tipo de inscrição',
      );
    },
  });

  return {
    handleCreateTypeInscription: createTypeInscriptionMutation,
    isCreatingTypeInscription,

    handleUpdateTypeInscription: ({
      typeInscriptionId,
      input,
    }: {
      typeInscriptionId: string;
      input: UpdateTypeInscriptionInput;
    }) => updateTypeInscriptionMutation({ typeInscriptionId, input }),
    isUpdatingTypeInscription,

    handleDeleteTypeInscription: deleteTypeInscriptionMutation,
    isDeletingTypeInscription,

    handleDisableTypeInscription: updateTypeInscriptionActiveMutation,
    isDisablingTypeInscription: isUpdatingTypeInscriptionActive,
  };
}
