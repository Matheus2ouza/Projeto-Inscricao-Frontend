import { useGlobalLoading } from "@/components/GlobalLoading";
import { modifyReceiptPayment } from "@/features/payment/api/analysisPayment/actions/modifyReceiptPayment";
import {
  ApprovePaymentInput,
  ApprovePaymentResponse,
} from "@/features/payment/types/analysisPayment/actions/approvePaymentTypes";
import {
  ModifyReceiptPaymentInput,
  ModifyReceiptPaymentResponse,
} from "@/features/payment/types/analysisPayment/actions/modifyReceiptPaymentTypes";
import {
  RejectedPaymentInput,
  RejectedPaymentResponse,
} from "@/features/payment/types/analysisPayment/actions/rejectedPaymentTypes";
import {
  ReversePaymentInput,
  ReversePaymentResponse,
} from "@/features/payment/types/analysisPayment/actions/reversePaymentTypes";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { approvePayment } from "../../../api/analysisPayment/actions/approvePayment";
import { rejectPayment } from "../../../api/analysisPayment/actions/rejectedPayment";
import { reversePayment } from "../../../api/analysisPayment/actions/reversePayment";
import { useInvalidateAnalysisPaymentDetailsQuery } from "../analysisPaymentDetailsQuery";

export function useActionsPayment() {
  const { setLoading } = useGlobalLoading();
  const { invalidateDetail, invalidateLists } =
    useInvalidateAnalysisPaymentDetailsQuery();

  const { mutateAsync: approvePaymentMutation, isPending: isApprovingPayment } =
    useMutation<ApprovePaymentResponse, Error, ApprovePaymentInput>({
      mutationFn: approvePayment,
      onMutate: () => setLoading(true),
      onSuccess: (_data, variables) => {
        toast.success("Pagamento aprovado com sucesso!");
        invalidateDetail(variables.paymentId);
        invalidateLists();
      },
      onError: (error: Error) => {
        toast.error(`Erro ao aprovar pagamento: ${error.message}`);
      },
      onSettled: () => setLoading(false),
    });

  const { mutateAsync: rejectPaymentMutation, isPending: isRejectingPayment } =
    useMutation<RejectedPaymentResponse, Error, RejectedPaymentInput>({
      mutationFn: rejectPayment,
      onMutate: () => setLoading(true),
      onSuccess: (_data, variables) => {
        toast.success("Pagamento reprovado com sucesso!");
        invalidateDetail(variables.paymentId);
        invalidateLists();
      },
      onError: (error: Error) => {
        toast.error(`Erro ao reprovar pagamento: ${error.message}`);
      },
      onSettled: () => setLoading(false),
    });

  const { mutateAsync: reversePaymentMutation, isPending: isReversingPayment } =
    useMutation<ReversePaymentResponse, Error, ReversePaymentInput>({
      mutationFn: reversePayment,
      onMutate: () => setLoading(true),
      onSuccess: (_data, variables) => {
        toast.success("Pagamento revertido com sucesso!");
        invalidateDetail(variables.paymentId);
        invalidateLists();
      },
      onError: (error: Error) => {
        toast.error(`Erro ao reverter pagamento: ${error.message}`);
      },
      onSettled: () => setLoading(false),
    });

  const {
    mutateAsync: modifyReceiptPaymentMutation,
    isPending: isModifingReceiptPayment,
  } = useMutation<
    ModifyReceiptPaymentResponse,
    Error,
    ModifyReceiptPaymentInput
  >({
    mutationFn: modifyReceiptPayment,
    onSuccess: (_data, variables) => {
      toast.success(`Comprovante Atualizado com sucesso`);
      invalidateDetail(variables.paymentId);
      invalidateLists();
    },
    onError: (error) => {
      toast.error(`Erro ao ao atualizar o comprovante: ${error.message}`);
    },
  });

  const handleApprovePayment = async ({
    paymentId,
  }: ApprovePaymentInput): Promise<ApprovePaymentResponse> => {
    return await approvePaymentMutation({ paymentId });
  };

  const handleRejectPayment = async ({
    paymentId,
    rejectionReason,
  }: RejectedPaymentInput): Promise<RejectedPaymentResponse> => {
    return await rejectPaymentMutation({ paymentId, rejectionReason });
  };

  const handleReversePayment = async ({
    paymentId,
  }: ReversePaymentInput): Promise<ReversePaymentResponse> => {
    return await reversePaymentMutation({ paymentId });
  };

  const handleModifyReceiptPayment = async ({
    paymentId,
    image,
  }: ModifyReceiptPaymentInput): Promise<ModifyReceiptPaymentResponse> => {
    return await modifyReceiptPaymentMutation({ paymentId, image });
  };

  return {
    handleApprovePayment,
    isApprovingPayment,
    handleRejectPayment,
    isRejectingPayment,
    handleReversePayment,
    isReversingPayment,
    handleModifyReceiptPayment,
    isModifingReceiptPayment,
  };
}
