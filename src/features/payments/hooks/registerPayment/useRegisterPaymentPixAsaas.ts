'use client';

import { useInvalidateDetailsGuestInscriptionQuery } from '@/features/guest/hook/detailsInscription/useDetailsInscriptionQuery';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { registerPaymentPixAssas } from '../../api/registerPayment/registerPaymentPix';
import { RegisterPaymentPixAssasResponse } from '../../types/registerPayment/registerPaymentTypesOld';

export function useRegisterPaymentPixAssas() {
  const { invalidateAll } = useInvalidateDetailsGuestInscriptionQuery();

  return useMutation({
    mutationFn: (inscriptionId: string) =>
      registerPaymentPixAssas(inscriptionId),
    onSuccess: async (data: RegisterPaymentPixAssasResponse) => {
      invalidateAll();
      // Redireciona o usuário para o link de pagamento do ASAAS
      window.location.href = data.link;
    },
    onError: (error) => {
      toast.error('Erro ao registrar pagamento', {
        description: error.message,
      });
    },
  });
}
