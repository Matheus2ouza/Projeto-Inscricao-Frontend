import { useGlobalLoading } from '@/components/GlobalLoading';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createNewRegister } from '../../api/createNewRegister/createNewRegister';
import {
  CreateNewRegisterInput,
  CreateNewRegisterResponse,
} from '../../types/createNewRegister/createNewRegisterTypes';
import { useInvalidateMovimentDetailQuery } from '../movimentDetails/useMovimentDetailsQuery';

export function useCreateNewRegister() {
  const { invalidateDetails } = useInvalidateMovimentDetailQuery();
  const { setLoading } = useGlobalLoading();

  const {
    mutateAsync: createNewRegisterMutation,
    isPending: isCreatingNewRegister,
  } = useMutation<CreateNewRegisterResponse, Error, CreateNewRegisterInput>({
    mutationFn: createNewRegister,
    onMutate: () => setLoading(true),
    onSuccess: () => {
      invalidateDetails();
      toast.success('Movimentação registrada com sucesso!');
    },
    onError: (error) => {
      toast.error(
        error.message ||
          'Não foi possível registrar a movimentação. Por favor, tente novamente.',
      );
    },
    onSettled: () => setLoading(false),
  });

  return {
    handleCreateNewRegister: createNewRegisterMutation,
    isCreatingNewRegister: isCreatingNewRegister,
  };
}
