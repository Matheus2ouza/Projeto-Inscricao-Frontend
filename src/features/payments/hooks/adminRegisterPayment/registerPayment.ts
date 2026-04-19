import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { registerPayment } from '../../api/adminRegisterPayment/registerPayment';
import {
  RegisterPaymentInput,
  RegisterPaymentResponse,
} from '../../types/adminRegisterPayment/registerPaymentType';
import { useInvalidateListInscriptionsPendingQuery } from './listInscriptionsPendingQuery';

export function useRegisterPayment() {
  const { invalidateAll } = useInvalidateListInscriptionsPendingQuery();

  const {
    mutateAsync: registerPaymentMutation,
    isPending: isRegisteringPayment,
  } = useMutation<RegisterPaymentResponse, Error, RegisterPaymentInput>({
    mutationFn: registerPayment,
    onSuccess: () => {
      toast.success('Pagamento registrado com sucesso!');
      invalidateAll();
    },
    onError: (error) => {
      toast.error(`Erro ao registrar pagamento: ${error.message}`);
    },
  });

  return {
    registerPayment: registerPaymentMutation,
    isRegisteringPayment,
  };
}
