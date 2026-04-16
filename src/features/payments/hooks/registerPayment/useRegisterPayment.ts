import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreatePaymentInscriptionRequest,
  registerPayment,
} from "../../api/registerPayment/registerPayment";
import { ListPaymentPendingKeys } from "./UseListPaymentPendingQuery";

export function useRegisterPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePaymentInscriptionRequest) =>
      registerPayment(payload),
    onSuccess: async (_, variables) => {
      // Invalida cache das inscrições envolvidas
      await queryClient.invalidateQueries({
        queryKey: ListPaymentPendingKeys.all,
      });

      // Invalida detalhes de cada inscrição se necessário
      if (variables.inscriptions) {
        for (const ins of variables.inscriptions) {
          await queryClient.invalidateQueries({
            queryKey: ["inscription-details", ins.id],
          });
        }
      }
    },
  });
}
