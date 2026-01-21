import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deletePayment as deletePaymentRequest } from "../api/deletePayment";
import { updatePaymentStatus } from "../api/updatePaymentStatus";
import { PaymentStatus } from "../types/analysisTypes";
import { useInvalidateAnalysisPayments } from "./useAnalysisInscriptionsQuery";

type RefusePaymentVariables = {
  paymentId: string;
  rejectionReason: string;
};

export function usePaymentActions() {
  const { invalidateAll: invalidateAnalysisCache } =
    useInvalidateAnalysisPayments();

  const reviewPaymentMutation = useMutation({
    mutationFn: (paymentId: string) =>
      updatePaymentStatus({
        paymentId,
        statusPayment: PaymentStatus.UNDER_REVIEW,
      }),
    onSuccess: () => {
      toast.success("Pagamento enviado para revisão!");
      invalidateAnalysisCache();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao enviar para revisão");
    },
  });

  const approvePaymentMutation = useMutation({
    mutationFn: (paymentId: string) =>
      updatePaymentStatus({
        paymentId,
        statusPayment: PaymentStatus.APPROVED,
      }),
    onSuccess: (data, paymentId) => {
      toast.success("Pagamento aprovado com sucesso!");
      // Invalidar cache para atualizar os dados
      invalidateAnalysisCache();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao aprovar pagamento");
    },
  });

  const refusePaymentMutation = useMutation({
    mutationFn: ({ paymentId, rejectionReason }: RefusePaymentVariables) =>
      updatePaymentStatus({
        paymentId,
        statusPayment: PaymentStatus.REFUSED,
        rejectionReason,
      }),
    onSuccess: () => {
      toast.success("Pagamento recusado!");
      // Invalidar cache para atualizar os dados
      invalidateAnalysisCache();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao recusar pagamento");
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: deletePaymentRequest,
    onSuccess: () => {
      toast.success("Pagamento deletado com sucesso!");
      invalidateAnalysisCache();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao deletar pagamento");
    },
  });

  return {
    approvePayment: approvePaymentMutation.mutate,
    refusePayment: refusePaymentMutation.mutate,
    reviewPayment: reviewPaymentMutation.mutate,
    deletePayment: deletePaymentMutation.mutate,
    isApproving: approvePaymentMutation.isPending,
    isRefusing: refusePaymentMutation.isPending,
    isReviewing: reviewPaymentMutation.isPending,
    isDeleting: deletePaymentMutation.isPending,
  };
}
