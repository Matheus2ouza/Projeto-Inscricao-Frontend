import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getTypeInscriptionsByEvent } from "../api/getTypeInscriptionsByEvent";
import { TypeInscriptions } from "../types/typesInscriptionsTypes";

// Chaves de query para tipos de inscrição
export const typeInscriptionsKeys = {
  all: ["typeInscriptions"] as const,
  byEvent: (eventId: string) =>
    [...typeInscriptionsKeys.all, "byEvent", eventId] as const,
};

export function useTypeInscriptionsQuery(
  eventId: string,
  options?: Omit<
    UseQueryOptions<TypeInscriptions[], Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: typeInscriptionsKeys.byEvent(eventId),
    queryFn: () => getTypeInscriptionsByEvent(eventId),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!eventId && (options?.enabled !== false), // Só executa se eventId existir e enabled não for false
    ...options,
  });
}

