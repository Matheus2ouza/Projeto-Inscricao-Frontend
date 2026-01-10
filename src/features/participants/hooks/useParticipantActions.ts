import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { inscriptionDetailsKeys } from "@/features/inscriptions/hooks/useInscriptionDetails";
import { deleteParticipant } from "@/features/participants/api/deleteParticipant";
import { updateParticipant } from "@/features/participants/api/updateParticipant";
import {
  UpdateParticipantFormInputs,
  UpdateParticipantSchema,
} from "@/features/participants/schema/updateParticipantSchema";

interface UseParticipantActionsOptions {
  participantId?: string;
  initialValues?: Partial<UpdateParticipantFormInputs>;
  onSuccess?: () => void;
  onDeleteSuccess?: () => void;
  inscriptionId?: string;
}

export function useParticipantActions({
  participantId,
  initialValues,
  onSuccess,
  onDeleteSuccess,
  inscriptionId,
}: UseParticipantActionsOptions) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateParticipantFormInputs>({
    resolver: zodResolver(UpdateParticipantSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      birthDate: initialValues?.birthDate ?? "",
      gender: initialValues?.gender ?? "",
      typeInscriptionId: initialValues?.typeInscriptionId ?? "",
    },
  });

  useEffect(() => {
    if (!initialValues) return;

    form.reset({
      name: initialValues.name ?? "",
      birthDate: initialValues.birthDate ?? "",
      gender: initialValues.gender ?? "",
      typeInscriptionId: initialValues.typeInscriptionId ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialValues?.name,
    initialValues?.birthDate,
    initialValues?.gender,
    initialValues?.typeInscriptionId,
    form,
  ]);

  const updateMutation = useMutation({
    mutationFn: async (values: UpdateParticipantFormInputs) => {
      if (!participantId) {
        throw new Error("Participante não encontrado.");
      }
      return updateParticipant(participantId, {
        ...values,
        birthDate: new Date(values.birthDate).toISOString(),
        typeInscriptionId: values.typeInscriptionId,
      });
    },
    onSuccess: async () => {
      toast.success("Participante atualizado com sucesso!");
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
          : "Não foi possível atualizar o participante.";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!participantId) {
        throw new Error("Participante não encontrado.");
      }
      return deleteParticipant(participantId);
    },
    onSuccess: async () => {
      toast.success("Participante excluído com sucesso!");
      if (inscriptionId) {
        await queryClient.invalidateQueries({
          queryKey: inscriptionDetailsKeys.detail(inscriptionId),
        });
      }
      onDeleteSuccess?.();
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao excluir participante.";
      toast.error(message);
    },
  });

  const handleSubmit = form.handleSubmit((values) =>
    updateMutation.mutate(values)
  );

  const handleDelete = async () => {
    deleteMutation.mutate();
  };

  return {
    form,
    handleSubmit,
    isUpdating: updateMutation.isPending,
    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
}
