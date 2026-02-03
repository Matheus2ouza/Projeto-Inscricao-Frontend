import { detailsGuestInscriptionKeys } from "@/features/guest/hook/detailsInscription/useDetailsInscriptionQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreatePaymentGuestInscriptionRequest,
  guestRegisterPayment,
} from "../../api/registerPayment/guestRegisterPayment";
import { ListPaymentPendingKeys } from "./UseListPaymentPendingQuery";

export function useGuestRegisterPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePaymentGuestInscriptionRequest) =>
      guestRegisterPayment(payload),
    onSuccess: async () => {
      // Invalida cache das inscrições envolvidas
      await queryClient.invalidateQueries({
        queryKey: ListPaymentPendingKeys.all,
      });

      await queryClient.invalidateQueries({
        queryKey: detailsGuestInscriptionKeys.all,
      });
    },
  });
}
