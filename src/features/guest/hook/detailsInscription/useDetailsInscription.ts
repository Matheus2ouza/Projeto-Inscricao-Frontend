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
    inscriptionDetails: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch: async () => {
      await refetch();
    },
  };
}
