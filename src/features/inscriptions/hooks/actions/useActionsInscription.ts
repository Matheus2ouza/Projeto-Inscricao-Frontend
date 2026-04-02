import { createPaymentLink } from "@/features/inscriptions/api/actions/createPaymentLink";
import { deleteInscription } from "@/features/inscriptions/api/actions/deleteInscription";
import { updateExpired } from "@/features/inscriptions/api/actions/updateExpired";
import { updateInscription } from "@/features/inscriptions/api/actions/updeteInscription";
import type {
  CreatePaymentLinkParams,
  CreatePaymentLinkResponse,
} from "@/features/inscriptions/types/actions/createPaymentLinkTypes";
import type { deleteInscriptionParams } from "@/features/inscriptions/types/actions/deleteInscriptionTypes";
import {
  UpdateExpiredInput,
  UpdateExpiredResponse,
} from "@/features/inscriptions/types/actions/updateExpiredTypes";
import {
  UpdateInscriptionInput,
  UpdateInscriptionResponse,
} from "@/features/inscriptions/types/actions/updeteInscriptionType";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useInvalidateDetailsInscriptionQuery } from "../list-inscriptions/inscription/useDetailsInscriptionQuery";
import { useInvalidateListInscriptionsQuery } from "../list-inscriptions/useListInscriptionsQuery";

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

  const {
    mutateAsync: updateInscriptionMutation,
    isPending: isUpdatingInscription,
  } = useMutation<UpdateInscriptionResponse, Error, UpdateInscriptionInput>({
    mutationFn: updateInscription,
    onSuccess: (_data, variables) => {
      toast.success(
        `Inscrição ${variables.responsible} atualizado com sucesso`,
      );
      invalidateInscriptionDetails();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar os dados da inscrição: ${error.message}`);
    },
  });

  return {
    // Atualiza expiração da inscrição
    handleUpdateExpired: updateExpiredMutation,
    isUpdatingExpired,

    // Cria o link de pagamento
    handleCreatePaymentLink: createPaymentLinkMutation,
    isCreatingPaymentLink,

    // Deleta a inscrição
    handleDeleteInscription: deleteInscriptionMutation,
    isDeletingInscription,

    // Atualiza os dados da inscrição
    handleUpdateInscription: updateInscriptionMutation,
    isUpdatingInscription,
  };
}
