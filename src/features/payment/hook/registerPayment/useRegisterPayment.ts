import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPayment,
  CreatePaymentInscriptionRequest,
} from "../../api/registerPayment/createPayment";
import { InscriptionsInAnalisisKeys } from "./UseInscriptionsInAnalisisQuery";

export function useRegisterPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePaymentInscriptionRequest) =>
      createPayment(payload),
    onSuccess: async (_, variables) => {
      // Invalida cache das inscrições envolvidas
      await queryClient.invalidateQueries({
        queryKey: InscriptionsInAnalisisKeys.all,
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
