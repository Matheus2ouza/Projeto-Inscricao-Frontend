import { createPaymentLink } from "@/features/inscriptions/api/list-inscriptions/actions/createPaymentLink";
import { updateExpired } from "@/features/inscriptions/api/list-inscriptions/actions/updateExpired";
import type {
  CreatePaymentLinkParams,
  CreatePaymentLinkResponse,
} from "@/features/inscriptions/types/list-inscriptions/actions/createPaymentLinkTypes";
import {
  UpdateExpiredInput,
  UpdateExpiredResponse,
} from "@/features/inscriptions/types/list-inscriptions/actions/updateExpiredTypes";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useInvalidateDetailsInscriptionQuery } from "../inscription/useDetailsInscriptionQuery";

export function useActionsInscription() {
  const { invalidateAll } = useInvalidateDetailsInscriptionQuery();

  const { mutateAsync: updateExpiredMutation, isPending: isUpdatingExpired } =
    useMutation<UpdateExpiredResponse, Error, UpdateExpiredInput>({
      mutationFn: updateExpired,
      onSuccess: () => {
        toast.success("Expiração atualizada com sucesso!");
        invalidateAll();
      },
      onError: (error) => {
        toast.error(`Erro ao atualizar expiração: ${error.message}`);
      },
    });

  const {
    mutateAsync: createPaymentLinkMutation,
    isPending: isCreatingPaymentLink,
  } = useMutation<CreatePaymentLinkResponse, Error, CreatePaymentLinkParams>({
    mutationFn: createPaymentLink,
    onSuccess: () => {
      toast.success("Link de pagamento criado com sucesso!");
      invalidateAll();
    },
    onError: (error) => {
      toast.error(`Erro ao criar link de pagamento: ${error.message}`);
    },
  });

  const handleUpdateExpired = async ({
    inscriptionId,
    expiresAt,
  }: UpdateExpiredInput): Promise<UpdateExpiredResponse> => {
    return await updateExpiredMutation({ inscriptionId, expiresAt });
  };

  const handleCreatePaymentLink = async ({
    inscriptionId,
  }: CreatePaymentLinkParams): Promise<CreatePaymentLinkResponse> => {
    return await createPaymentLinkMutation({ inscriptionId });
  };

  return {
    handleUpdateExpired,
    isUpdatingExpired,
    handleCreatePaymentLink,
    isCreatingPaymentLink,
  };
}
