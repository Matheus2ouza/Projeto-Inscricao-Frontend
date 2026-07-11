import { registerPaymentAction } from '@/features/payments/actions/registerPayment/registerPaymentAction';
import type {
  RegisterPaymentInput,
  RegisterPaymentResponse,
} from '@/features/payments/types/registerPayment/registerPaymentTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ListPaymentPendingKeys } from './UseListPaymentPendingQuery';

export function useRegisterPayment() {
  const queryClient = useQueryClient();

  return useMutation<
    RegisterPaymentResponse,
    Error,
    { eventId: string; input: RegisterPaymentInput }
  >({
    mutationFn: ({ eventId, input }) => registerPaymentAction(eventId, input),
    onSuccess: async (_, variables) => {
      // Invalida cache das inscrições envolvidas
      await queryClient.invalidateQueries({
        queryKey: ListPaymentPendingKeys.all,
      });

      // Invalida detalhes de cada inscrição se necessário
      if (variables.input.inscriptions) {
        for (const ins of variables.input.inscriptions) {
          await queryClient.invalidateQueries({
            queryKey: ['inscription-details', ins.id],
          });
        }
      }

      // Opcional: Invalida também o cache do evento específico
      if (variables.eventId) {
        await queryClient.invalidateQueries({
          queryKey: ['event-details', variables.eventId],
        });
      }
    },
  });
}
