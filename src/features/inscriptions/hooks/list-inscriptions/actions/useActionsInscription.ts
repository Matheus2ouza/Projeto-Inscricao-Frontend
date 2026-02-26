import { createPaymentLink } from "@/features/inscriptions/api/list-inscriptions/actions/createPaymentLink";
import { deleteInscription } from "@/features/inscriptions/api/list-inscriptions/actions/deleteInscription";
import { updateExpired } from "@/features/inscriptions/api/list-inscriptions/actions/updateExpired";
import type {
  CreatePaymentLinkParams,
  CreatePaymentLinkResponse,
} from "@/features/inscriptions/types/list-inscriptions/actions/createPaymentLinkTypes";
import type { deleteInscriptionParams } from "@/features/inscriptions/types/list-inscriptions/actions/deleteInscriptionTypes";
import {
  UpdateExpiredInput,
  UpdateExpiredResponse,
} from "@/features/inscriptions/types/list-inscriptions/actions/updateExpiredTypes";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useInvalidateDetailsInscriptionQuery } from "../inscription/useDetailsInscriptionQuery";
import { useInvalidateListInscriptionsQuery } from "../useListInscriptionsQuery";

export function useActionsInscription() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    invalidateAll: invalidateInscriptionDetails,
    removeAll: removeInscriptionDetails,
  } = useInvalidateDetailsInscriptionQuery();
  const { invalidateAll: invalidateListInscriptions } =
    useInvalidateListInscriptionsQuery();

  // Atualiza a expiração da inscrição
  const { mutateAsync: updateExpiredMutation, isPending: isUpdatingExpired } =
    useMutation<UpdateExpiredResponse, Error, UpdateExpiredInput>({
      mutationFn: updateExpired,
      onSuccess: () => {
        toast.success("Expiração atualizada com sucesso!");
        invalidateInscriptionDetails();
      },
      onError: (error) => {
        toast.error(`Erro ao atualizar expiração: ${error.message}`);
      },
    });

  const handleUpdateExpired = async ({
    inscriptionId,
    expiresAt,
  }: UpdateExpiredInput): Promise<UpdateExpiredResponse> => {
    return await updateExpiredMutation({ inscriptionId, expiresAt });
  };

  // Cria (ou reativa) o link de pagamento da inscrição
  const {
    mutateAsync: createPaymentLinkMutation,
    isPending: isCreatingPaymentLink,
  } = useMutation<CreatePaymentLinkResponse, Error, CreatePaymentLinkParams>({
    mutationFn: createPaymentLink,
    onSuccess: () => {
      toast.success("Link de pagamento criado com sucesso!");
      invalidateInscriptionDetails();
    },
    onError: (error) => {
      toast.error(`Erro ao criar link de pagamento: ${error.message}`);
    },
  });

  // Deleta a inscrição
  const {
    mutateAsync: deleteInscriptionMutation,
    isPending: isDeletingInscription,
  } = useMutation<void, Error, deleteInscriptionParams>({
    mutationFn: deleteInscription,
    onSuccess: (_data, variables) => {
      toast.success("Inscrição deletada com sucesso!");
      removeInscriptionDetails();
      invalidateListInscriptions();
      const basePath = pathname?.startsWith("/super/") ? "/super" : "/admin";
      router.replace(
        `${basePath}/inscriptions/list-inscriptions/${variables.eventId}`,
      );
    },
    onError: (error) => {
      toast.error(`Erro ao deletar a inscrição: ${error.message}`);
    },
  });

  const handleCreatePaymentLink = async ({
    inscriptionId,
  }: CreatePaymentLinkParams): Promise<CreatePaymentLinkResponse> => {
    return await createPaymentLinkMutation({ inscriptionId });
  };

  const handleDeleteInscription = async ({
    eventId,
    inscriptionId,
  }: deleteInscriptionParams): Promise<void> => {
    await deleteInscriptionMutation({ eventId, inscriptionId });
  };

  return {
    handleUpdateExpired,
    isUpdatingExpired,
    handleCreatePaymentLink,
    isCreatingPaymentLink,
    handleDeleteInscription,
    isDeletingInscription,
  };
}
