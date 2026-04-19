import { deletePayment } from '@/features/payments/api/listPayment/deletePayment';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useInvalidateMyInscriptionsQuery } from './useMyInscriptionsQuery';

export function useMyInscriptionActions() {
  const { invalidateLists } = useInvalidateMyInscriptionsQuery();

  const { mutateAsync: removePayment, isPending: isDeleting } = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      toast.success('Inscrição removida com sucesso!');
      invalidateLists();
    },
    onError: (error) => {
      toast.error(`Erro ao remover inscrição: ${error.message}`);
    },
  });

  const handleDeleteInscription = async (inscriptionId: string) => {
    await removePayment(inscriptionId);
  };

  return {
    handleDeleteInscription,
    isDeleting,
  };
}
