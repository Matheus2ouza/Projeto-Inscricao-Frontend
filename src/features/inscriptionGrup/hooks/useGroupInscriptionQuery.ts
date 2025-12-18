import { eventsKeys } from "@/features/gastos/hooks/useEventsQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmGroupInscription } from "../api/confirmGroupInscription";
import { submitGroupInscription } from "../api/submitGroupInscription";

// Chaves de query para inscrições em grupo
export const groupInscriptionKeys = {
  all: ["groupInscriptions"] as const,
  submissions: () => [...groupInscriptionKeys.all, "submissions"] as const,
  confirmations: () => [...groupInscriptionKeys.all, "confirmations"] as const,
};

// Hook para submeter inscrição em grupo
export function useSubmitGroupInscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitGroupInscription,
    onSuccess: () => {
      // Invalidar cache de eventos para atualizar dados
      queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
    onError: (error) => {
      console.error("Erro ao submeter inscrição em grupo:", error);
    },
  });
}

// Hook para confirmar inscrição em grupo
export function useConfirmGroupInscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmGroupInscription,
    onSuccess: () => {
      // Invalidar cache de eventos para atualizar dados
      queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
    onError: (error) => {
      console.error("Erro ao confirmar inscrição em grupo:", error);
    },
  });
}
