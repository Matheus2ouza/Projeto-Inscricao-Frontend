import { deletePaymentAction } from '@/features/payments/actions/deletePayment/deletePaymentAction';
import { useInvalidateListPaymentQuery } from '@/features/payments/hooks/listPayment/useListPaymentQuery';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useInvalidateListPaymentPendingQuery } from '../registerPayment/UseListPaymentPendingQuery';

export function useActionsPayments() {
  const { invalidateLists } = useInvalidateListPaymentQuery();
  const { invalidateLists: invalidateListsPaymentsPending } =
    useInvalidateListPaymentPendingQuery();

  const { mutateAsync: removePayment, isPending: isDeleting } = useMutation({
    mutationFn: deletePaymentAction,
    onSuccess: () => {
      toast.success('Pagamento removido com sucesso!');
      invalidateLists();
      invalidateListsPaymentsPending();
    },
    onError: (error) => {
      toast.error(`Erro ao remover pagamento: ${error.message}`);
    },
  });

  const handleDeletePayment = async (paymentId: string) => {
    await removePayment(paymentId);
  };

  return {
    handleDeletePayment,
    isDeleting,
  };
}
