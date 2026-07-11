import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateInscriptionAction } from '@/features/inscriptions/actions/updateInscription/updateInscriptionAction';
import { deleteInscription } from '@/features/inscriptions/api/deleteInscription';
import { inscriptionDetailsKeys } from '@/features/inscriptions/hooks/useInscriptionDetails';
import {
  UpdateInscriptionFormInputs,
  UpdateInscriptionSchema,
} from '@/features/inscriptions/schema/updateInscriptionSchema';

interface UseUpdateInscriptionOptions {
  inscriptionId?: string;
  initialValues?: Partial<UpdateInscriptionFormInputs>;
  onSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

export function useUpdateInscription({
  inscriptionId,
  initialValues,
  onSuccess,
  onDeleteSuccess,
}: UseUpdateInscriptionOptions) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateInscriptionFormInputs>({
    resolver: zodResolver(UpdateInscriptionSchema),
    defaultValues: {
      responsible: initialValues?.responsible ?? '',
      phone: initialValues?.phone ?? '',
      email: initialValues?.email ?? '',
    },
  });

  useEffect(() => {
    if (!initialValues) return;

    form.reset({
      responsible: initialValues.responsible ?? '',
      phone: initialValues.phone ?? '',
      email: initialValues.email ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialValues?.responsible,
    initialValues?.phone,
    initialValues?.email,
    form,
  ]);

  const mutation = useMutation({
    mutationFn: async (values: UpdateInscriptionFormInputs) => {
      if (!inscriptionId) {
        throw new Error('Inscrição não encontrada.');
      }
      return updateInscriptionAction(inscriptionId, values);
    },
    onSuccess: async () => {
      toast.success('Inscrição atualizada com sucesso!');
      if (inscriptionId) {
        await queryClient.invalidateQueries({
          queryKey: inscriptionDetailsKeys.detail(inscriptionId),
        });
      }
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível atualizar a inscrição.';
      toast.error(message);
    },
  });

  const handleSubmit = form.handleSubmit((values) => mutation.mutate(values));

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!inscriptionId) {
        throw new Error('Inscrição não encontrada.');
      }
      return deleteInscription(inscriptionId);
    },
    onMutate: async () => {
      if (!inscriptionId) return;

      // Marcar inscrição como deletada no cache para evitar queries futuras
      queryClient.setQueryData(
        ['deleted-inscriptions'],
        (old: Set<string> | undefined) => {
          const deletedSet = old || new Set();
          deletedSet.add(inscriptionId);
          return new Set(deletedSet);
        },
      );

      // Cancelar todas as queries relacionadas à inscrição antes de deletar
      await queryClient.cancelQueries({
        queryKey: inscriptionDetailsKeys.detail(inscriptionId),
      });

      // Remover dados da inscrição do cache
      queryClient.removeQueries({
        queryKey: inscriptionDetailsKeys.detail(inscriptionId),
      });
    },
    onSuccess: async () => {
      toast.success('Inscrição excluída com sucesso!');

      if (inscriptionId) {
        // Garantir que a inscrição permaneça marcada como deletada
        queryClient.setQueryData(
          ['deleted-inscriptions'],
          (old: Set<string> | undefined) => {
            const deletedSet = old || new Set();
            deletedSet.add(inscriptionId);
            return new Set(deletedSet);
          },
        );

        // Invalidar apenas as listas de inscrições
        await queryClient.invalidateQueries({
          queryKey: inscriptionDetailsKeys.all,
        });
      }

      // Redirecionar imediatamente após sucesso
      onDeleteSuccess?.();
    },
    onError: (error) => {
      // Em caso de erro, remover a marcação de deletada
      if (inscriptionId) {
        queryClient.setQueryData(
          ['deleted-inscriptions'],
          (old: Set<string> | undefined) => {
            if (!old) return old;
            const deletedSet = new Set(old);
            deletedSet.delete(inscriptionId);
            return deletedSet.size > 0 ? deletedSet : undefined;
          },
        );
      }

      const message =
        error instanceof Error ? error.message : 'Erro ao excluir inscrição.';
      toast.error(message);
    },
  });

  const handleDelete = async () => {
    deleteMutation.mutate();
  };

  return {
    form,
    handleSubmit,
    isUpdating: mutation.isPending,
    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
}
