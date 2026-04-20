import { useGlobalLoading } from '@/components/GlobalLoading';
import { deletePayment } from '@/features/payments/api/adminDetailsPayment/actions/deletePayment';
import { modifyReceiptPayment } from '@/features/payments/api/adminDetailsPayment/actions/modifyReceiptPayment';
import { useInvalidatePaymentDetailQuery } from '@/features/payments/hooks/adminDetailsPayment/usePaymentDetailQuery';
import { DeletePaymentInput } from '@/features/payments/types/adminDetailsPayment/actions/deletePaymentTypes';
import {
  ModifyReceiptPaymentInput,
  ModifyReceiptPaymentResponse,
} from '@/features/payments/types/adminDetailsPayment/actions/modifyReceiptPaymentTypes';
import { useMutation } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useInvalidatePaymentsList } from '../../adminListPaymants/usePaymentsListQuery';

export function useActionsPayment() {
  const router = useRouter();
  const pathname = usePathname();
  const { setLoading } = useGlobalLoading();

  const {
    invalidateAll: invalidatePaymentDetailAll,
    removeAll: removePaymentDetailAll,
  } = useInvalidatePaymentDetailQuery();
  const { invalidateAll: invalidatePaymentsListAll } =
    useInvalidatePaymentsList();

  // Mutation para excluir um pagamento
  const { mutateAsync: deletePaymentMutation, isPending: isDeletingPayment } =
    useMutation<void, Error, DeletePaymentInput>({
      mutationFn: deletePayment,
      onMutate: () => setLoading(true),
      onSuccess: (_, variables) => {
        // remove o cache do detalhe do pagamento excluído
        removePaymentDetailAll();
        // Invalida o cache da lista de pagamentos
        invalidatePaymentsListAll();
        toast.success('Pagamento excluído com sucesso!');

        const basePath = pathname?.startsWith('/super/') ? '/super' : '/admin';
        // Redireciona para a lista de pagamentos com base no role do usuário
        router.push(
          `/${basePath}/payments/list-payments/${variables.paymentId}`,
        );
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao excluir pagamento.');
      },
      onSettled: () => setLoading(false),
    });

  const handleDeletePayment = async ({ paymentId }: DeletePaymentInput) => {
    return await deletePayment({ paymentId });
  };

  const {
    mutateAsync: modifyReceiptPaymentMutation,
    isPending: isModifingReceiptPayment,
  } = useMutation<
    ModifyReceiptPaymentResponse,
    Error,
    ModifyReceiptPaymentInput
  >({
    mutationFn: modifyReceiptPayment,
    onSuccess: (_data, variables) => {
      toast.success(`Comprovante Atualizado com sucesso`);
      invalidatePaymentDetailAll();
    },
    onError: (error) => {
      toast.error(`Erro ao ao atualizar o comprovante: ${error.message}`);
    },
  });

  const handleModifyReceiptPayment = async ({
    paymentId,
    image,
  }: ModifyReceiptPaymentInput): Promise<ModifyReceiptPaymentResponse> => {
    return await modifyReceiptPaymentMutation({ paymentId, image });
  };

  return {
    handleDeletePayment,
    isDeletingPayment,
    handleModifyReceiptPayment,
    isModifingReceiptPayment,
  };
}
