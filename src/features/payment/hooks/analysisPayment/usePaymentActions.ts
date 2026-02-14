import { useGlobalLoading } from "@/components/GlobalLoading";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { approvePayment } from "../../api/analysisPayment/approve_payment";
import { rejectPayment } from "../../api/analysisPayment/rejected-payment";
import { reversePayment } from "../../api/analysisPayment/reverse-payment";
import { useInvalidateAnalysisPaymentDetailsQuery } from "./analysisPaymentDetailsQuery";

export function usePaymentActions() {
  const { setLoading } = useGlobalLoading();
  const { invalidateDetail, invalidateLists } =
    useInvalidateAnalysisPaymentDetailsQuery();

  const approveMutation = useMutation({
    mutationFn: (paymentId: string) => approvePayment(paymentId),
    onMutate: () => setLoading(true),
    onSuccess: (_, paymentId) => {
      toast.success("Pagamento aprovado com sucesso!");
      invalidateDetail(paymentId);
      invalidateLists();
    },
    onError: (error: Error) => {
      toast.error(`Erro ao aprovar pagamento: ${error.message}`);
    },
    onSettled: () => setLoading(false),
  });

  const rejectMutation = useMutation({
    mutationFn: ({
      paymentId,
      reason,
    }: {
      paymentId: string;
      reason: string;
    }) => rejectPayment(paymentId, reason),
    onMutate: () => setLoading(true),
    onSuccess: (_, { paymentId }) => {
      toast.success("Pagamento reprovado com sucesso!");
      invalidateDetail(paymentId);
      invalidateLists();
    },
    onError: (error: Error) => {
      toast.error(`Erro ao reprovar pagamento: ${error.message}`);
    },
    onSettled: () => setLoading(false),
  });

  const reverseMutation = useMutation({
    mutationFn: (paymentId: string) => reversePayment(paymentId),
    onMutate: () => setLoading(true),
    onSuccess: (_, paymentId) => {
      toast.success("Pagamento revertido com sucesso!");
      invalidateDetail(paymentId);
      invalidateLists();
    },
    onError: (error: Error) => {
      toast.error(`Erro ao reverter pagamento: ${error.message}`);
    },
    onSettled: () => setLoading(false),
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
