import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { modifyReceiptPayment } from "../../../api/detailsInscription/actions/modifyReceiptPayment";
import {
  ModifyReceiptPaymentInput,
  ModifyReceiptPaymentResponse,
} from "../../../types/detailsInscription/actions/modifyReceiptPaymentTypes";
import { useInvalidateDetailsGuestInscriptionQuery } from "../useDetailsInscriptionQuery";

export function useModifyReceiptPayment() {
  const { invalidateAll } = useInvalidateDetailsGuestInscriptionQuery();
  const {
    mutateAsync: modifyReceiptPaymentMutation,
    isPending: isModifingReceiptPayment,
  } = useMutation<
    ModifyReceiptPaymentResponse,
    Error,
    ModifyReceiptPaymentInput
  >({
    mutationFn: modifyReceiptPayment,
    onSuccess: () => {
      toast.success(`Comprovante Atualizado com sucesso`);
      invalidateAll();
    },
    onError: (error) => {
      toast.error(`Erro ao ao atualizar o comprovante: ${error.message}`);
    },
  });

  const handleModifyReceiptPayment = async ({
    paymentId,
    image,
  }: ModifyReceiptPaymentInput): Promise<ModifyReceiptPaymentResponse> => {
    return await modifyReceiptPaymentMutation({ paymentId, image });
  };

  return {
    handleModifyReceiptPayment,
    isModifingReceiptPayment,
  };
}
