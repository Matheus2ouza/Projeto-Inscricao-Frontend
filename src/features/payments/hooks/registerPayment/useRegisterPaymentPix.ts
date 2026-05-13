'use client';

import { detailsGuestInscriptionKeys } from '@/features/guest/hook/detailsInscription/useDetailsInscriptionQuery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  RegisterPaymentPixRequest,
  registerPaymentPix,
} from '../../api/registerPayment/registerPaymentPix';
import { ListPaymentPendingKeys } from './UseListPaymentPendingQuery';

export function useRegisterPaymentPix() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPaymentPixRequest) =>
      registerPaymentPix(payload),
    onSuccess: async (data, variables) => {
      // Invalida cache das inscrições envolvidas
      await queryClient.invalidateQueries({
        queryKey: ListPaymentPendingKeys.all,
      });

      // Invalida cache de detalhes da inscrição Guest
      await queryClient.invalidateQueries({
        queryKey: detailsGuestInscriptionKeys.all,
      });

      // Redireciona para a página de sucesso
      router.push(
        `/guest/${variables.eventId}/payment/success?eventId=${variables.eventId}&clientName=${variables.guestName}&confirmationCode=${data.confirmationCode}`,
      );
    },
    onError: (error) => {
      toast.error('Erro ao registrar pagamento', {
        description: error.message,
      });
    },
  });
}
