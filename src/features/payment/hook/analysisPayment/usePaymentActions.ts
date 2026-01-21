import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { approvePayment } from "../../api/analysisPayment/approve_payment";
import { rejectPayment } from "../../api/analysisPayment/rejected-payment";
import { reversePayment } from "../../api/analysisPayment/reverse-payment";
import { useInvalidateAnalysisPaymentDetailsQuery } from "./analysisPaymentDetailsQuery";

export function usePaymentActions() {
  const { invalidateDetail, invalidateLists } =
    useInvalidateAnalysisPaymentDetailsQuery();

  const approveMutation = useMutation({
    mutationFn: (paymentId: string) => approvePayment(paymentId),
    onSuccess: (_, paymentId) => {
      toast.success("Pagamento aprovado com sucesso!");
      invalidateDetail(paymentId);
      invalidateLists();
    },
    onError: (error: Error) => {
      toast.error(`Erro ao aprovar pagamento: ${error.message}`);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({
      paymentId,
      reason,
    }: {
      paymentId: string;
      reason: string;
    }) => rejectPayment(paymentId, reason),
    onSuccess: (_, { paymentId }) => {
      toast.success("Pagamento reprovado com sucesso!");
      invalidateDetail(paymentId);
      invalidateLists();
    },
    onError: (error: Error) => {
      toast.error(`Erro ao reprovar pagamento: ${error.message}`);
    },
  });

  const reverseMutation = useMutation({
    mutationFn: (paymentId: string) => reversePayment(paymentId),
    onSuccess: (_, paymentId) => {
      toast.success("Pagamento revertido com sucesso!");
      invalidateDetail(paymentId);
      invalidateLists();
    },
    onError: (error: Error) => {
      toast.error(`Erro ao reverter pagamento: ${error.message}`);
    },
  });

  return {
    approvePayment: approveMutation.mutateAsync,
    rejectPayment: rejectMutation.mutateAsync,
    reversePayment: reverseMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isReversing: reverseMutation.isPending,
  };
}
