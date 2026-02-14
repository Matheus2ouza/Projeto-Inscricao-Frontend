import { useGlobalLoading } from "@/components/GlobalLoading";
import { UserRole } from "@/features/auth/types/loginTypes";
import { deletePayment } from "@/features/payment/api/adminDetailsPayment/actions/deletePayment";
import { useInvalidatePaymentDetailQuery } from "@/features/payment/hooks/adminDetailsPayment/usePaymentDetailQuery";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useInvalidatePaymentsList } from "../../adminListPaymants/usePaymentsListQuery";

export function useDeletePayment(eventId: string, role: UserRole) {
  const router = useRouter();
  const { setLoading } = useGlobalLoading();

  const { invalidateAll: invalidatePaymentDetailAll } =
    useInvalidatePaymentDetailQuery();
  const { invalidateAll: invalidatePaymentsListAll } =
    useInvalidatePaymentsList();

  // Mutation para excluir um pagamento
  const deletePaymentMutation = useMutation({
    mutationFn: (paymentId: string) => deletePayment(paymentId),
    onMutate: () => setLoading(true),
    onSuccess: () => {
      // Invalida o cache do detalhe do pagamento excluído
      invalidatePaymentDetailAll();
      // Invalida o cache da lista de pagamentos
      invalidatePaymentsListAll();
      toast.success("Pagamento excluído com sucesso!");

      
      // Redireciona para a lista de pagamentos com base no role do usuário
      router.push(`/${role.toLowerCase()}/payments/list-payments/${eventId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao excluir pagamento.");
    },
    onSettled: () => setLoading(false),
  });

  return {
    deletePaymentMutation,
  };
}
