import {
  DetailsInscriptionParams,
  DetailsInscriptionResult,
} from "../../types/detailsInscription/detailsInscriptionType";
import { useDetailsInscriptionQuery } from "./useDetailsInscriptionQuery";

export function useDetailsInscription({
  confirmationCode,
}: DetailsInscriptionParams): DetailsInscriptionResult {
  const { data, isLoading, error, refetch } =
    useDetailsInscriptionQuery(confirmationCode);

  return {
    inscription: data || null,
    participants: data?.participants || [],
    payments: data?.payments || [],
    loading: isLoading,
    error: error?.message || null,
    refetch: async () => {
      await refetch();
    },
  };
}
