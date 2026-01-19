import { useQuery } from "@tanstack/react-query";
import { getTypeInscriptions } from "../../api/inscriptionIndiv/getTypeInscriptions";

// Chaves de query para tipos de inscrição
export const typeInscriptionsKeys = {
  all: ["typeInscriptions"] as const,
  byEvent: (eventId: string) =>
    [...typeInscriptionsKeys.all, "byEvent", eventId] as const,
};

export function useTypeInscriptionsQuery(eventId: string) {
  return useQuery({
    queryKey: typeInscriptionsKeys.byEvent(eventId),
    queryFn: () => getTypeInscriptions(eventId),
    staleTime: 10 * 60 * 1000, // 10 minutos (tipos de inscrição mudam menos)
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!eventId, // Só executa se eventId existir
  });
}
