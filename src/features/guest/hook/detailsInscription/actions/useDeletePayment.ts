import { useGlobalLoading } from '@/components/GlobalLoading';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deletePayment } from '../../../api/detailsInscription/actions/deletePayment';
import { useInvalidateDetailsGuestInscriptionQuery } from '../useDetailsInscriptionQuery';

export function useDeletePayment() {
  const { setLoading } = useGlobalLoading();
  const { invalidateAll } = useInvalidateDetailsGuestInscriptionQuery();
  const deletePaymentMutation = useMutation({
    mutationFn: (paymentId: string) => deletePayment(paymentId),
    onMutate: () => setLoading(true),
    onSuccess: () => {
      invalidateAll();
      toast.success('Pagamento excluído com sucesso!');
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao excluir pagamento.');
    },
    onSettled: () => setLoading(false),
  });

  return {
    deletePaymentMutation,
  };
}
