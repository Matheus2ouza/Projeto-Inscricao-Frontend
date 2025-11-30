import { inscriptionDetailsKeys } from "@/features/inscriptions/hooks/useInscriptionDetails";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPayment,
  CreatePaymentInscriptionRequest,
} from "../api/createPayment";

export function useRegisterPayment(inscriptionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: Omit<CreatePaymentInscriptionRequest, "inscriptionId">
    ) => createPayment({ inscriptionId, ...payload }),
    onSuccess: async () => {
      // Invalida cache dos detalhes da inscrição para recarregar a lista de pagamentos
      await queryClient.invalidateQueries({
        queryKey: inscriptionDetailsKeys.detail(inscriptionId),
      });
    },
  });
}
