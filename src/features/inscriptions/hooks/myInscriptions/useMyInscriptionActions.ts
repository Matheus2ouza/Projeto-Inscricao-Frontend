import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteInscriptionAction } from '../../actions/deleteInscription/deleteInscriptionAction';
import { useInvalidateMyInscriptionsQuery } from './useMyInscriptionsQuery';

export function useMyInscriptionActions() {
  const { invalidateLists } = useInvalidateMyInscriptionsQuery();

  const { mutateAsync: removeInscription, isPending: isDeleting } = useMutation(
    {
      mutationFn: deleteInscriptionAction,
      onSuccess: () => {
        toast.success('Inscrição removida com sucesso!');
        invalidateLists();
      },
      onError: (error) => {
        toast.error(`Erro ao remover inscrição: ${error.message}`);
      },
    },
  );

  const handleDeleteInscription = async (inscriptionId: string) => {
    await removeInscription(inscriptionId);
  };

  return {
    handleDeleteInscription,
    isDeleting,
  };
}
