import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  deleteInscription,
  updateInscription,
} from "../../api/MyInscriptions/updateInscription";
import { UpdateInscriptionSchemaType } from "../../schema/myInscriptions/updateInscriptioSchema";
import { UpdateInscriptionSchema } from "../../schema/updateInscriptionSchema";
import { DetailsInscriptionKey } from "./useDetailsInscriptionQuery";
import { MyInscriptionsKey } from "./useMyInscriptionsQuery";

interface useFormUpdateInscriptionParams {
  inscriptionId: string;
  initialValues?: Partial<UpdateInscriptionSchemaType>;
  onSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

export function useFormUpdateInscription({
  inscriptionId,
  initialValues,
  onSuccess,
  onDeleteSuccess,
}: useFormUpdateInscriptionParams) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateInscriptionSchemaType>({
    resolver: zodResolver(UpdateInscriptionSchema),
    defaultValues: {
      responsible: initialValues?.responsible ?? "",
      email: initialValues?.email ?? "",
      phone: initialValues?.phone ?? "",
    },
  });

  useEffect(() => {
    if (!initialValues) return;

    form.reset({
      responsible: initialValues.responsible ?? "",
      email: initialValues.email ?? "",
      phone: initialValues.phone ?? "",
    });
  }, [
    initialValues?.responsible,
    initialValues?.email,
    initialValues?.phone,
    form,
  ]);

  const mutation = useMutation({
    mutationFn: async (values: UpdateInscriptionSchemaType) => {
      return await updateInscription(inscriptionId, values);
    },
    onSuccess: async () => {
      toast.success("Inscrição atualizada com sucesso!");
      if (inscriptionId) {
        queryClient.invalidateQueries({
          queryKey: DetailsInscriptionKey.detail(inscriptionId),
        });
      }
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a inscrição.";
      toast.error(message);
    },
  });

  const handleSubmit = form.handleSubmit((values) => mutation.mutate(values));

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!inscriptionId) {
        throw new Error("Inscrição não encontrada.");
      }
      return deleteInscription(inscriptionId);
    },
    onMutate: async () => {
      if (!inscriptionId) return;

      queryClient.setQueryData(
        ["deleted-inscriptions"],
        (old: Set<string> | undefined) => {
          const deletedSet = old || new Set();
          deletedSet.add(inscriptionId);
          return new Set(deletedSet);
        }
      );

      await queryClient.cancelQueries({
        queryKey: DetailsInscriptionKey.detail(inscriptionId),
      });

      queryClient.removeQueries({
        queryKey: DetailsInscriptionKey.detail(inscriptionId),
      });
    },
    onSuccess: async () => {
      toast.success("Inscrição excluída com sucesso!");

      if (inscriptionId) {
        queryClient.setQueryData(
          ["deleted-inscriptions"],
          (old: Set<string> | undefined) => {
            const deletedSet = old || new Set();
            deletedSet.add(inscriptionId);
            return new Set(deletedSet);
          }
        );

        queryClient.invalidateQueries({
          queryKey: DetailsInscriptionKey.all,
        });

        queryClient.invalidateQueries({
          queryKey: MyInscriptionsKey.lists(),
        });
      }

      onDeleteSuccess?.();
    },
    onError: (error) => {
      if (inscriptionId) {
        queryClient.setQueryData(
          ["deleted-inscriptions"],
          (old: Set<string> | undefined) => {
            if (!old) return old;
            const deletedSet = new Set(old);
            deletedSet.delete(inscriptionId);
            return deletedSet.size > 0 ? deletedSet : undefined;
          }
        );
      }

      const message =
        error instanceof Error ? error.message : "Erro ao excluir inscrição.";
      toast.error(message);
    },
  });

  const handleDelete = () => {
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
