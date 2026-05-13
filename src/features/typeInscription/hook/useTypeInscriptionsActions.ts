import {
  updateTypeInscription,
  UpdateTypeInscriptionInput,
} from '@/features/typeInscription/api/updateTypeInscription';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createTypeInscription } from '../api/createTypeInscription';
import { deleteTypeInscription } from '../api/deleteTypeInscription';
import { updateTypeInscriptionActive } from '../api/updateTypeInscriptionActive';
import { useInvalidateTypeInscriptionsQuery } from './useTypeInscriptionsQuery';

export function useTypeInscriptionsActions(eventId: string) {
  const { invalidateDetail } = useInvalidateTypeInscriptionsQuery();

  // create
  const {
    mutateAsync: createTypeInscriptionMutation,
    isPending: isCreatingTypeInscription,
  } = useMutation({
    mutationFn: createTypeInscription,
    onSuccess: () => {
      invalidateDetail(eventId);
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
    }) => updateTypeInscription(typeInscriptionId, input),
    onSuccess: () => {
      invalidateDetail(eventId);
      toast.success('Tipo de inscrição atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar tipo de inscrição');
    },
  });

  // detele
  const {
    mutateAsync: deleteTypeInscriptionMutation,
    isPending: isDeletingTypeInscription,
  } = useMutation({
    mutationFn: deleteTypeInscription,
    onSuccess: () => {
      invalidateDetail(eventId);
      toast.success('Tipo de inscrição excluído com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir tipo de inscrição');
    },
  });

  // update active
  const {
    mutateAsync: updateTypeInscriptionActiveMutation,
    isPending: isUpdateTypeInscriptionActive,
  } = useMutation({
    mutationFn: ({
      typeInscriptionId,
      active,
    }: {
      typeInscriptionId: string;
      active: boolean;
    }) => updateTypeInscriptionActive(typeInscriptionId, active),
    onSuccess: (_data, variables) => {
      invalidateDetail(eventId);
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
    isDisablingTypeInscription: isUpdateTypeInscriptionActive,
  };
}
