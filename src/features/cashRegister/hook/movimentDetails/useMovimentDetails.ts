import {
  MovimentDetailsParams,
  MovimentDetailsResult,
} from "../../types/movimentDetails/movimentDetailsTypes";
import { useMovimentDetailsQuery } from "./useMovimentDetailsQuery";

export function useMovimentDetails({
  movimentId,
}: MovimentDetailsParams): MovimentDetailsResult {
  const { data, isLoading, isFetched, error, refetch } =
    useMovimentDetailsQuery(movimentId);

  const reference = data?.reference ?? null;

  const referenceId = (() => {
    if (!reference) return null;
    switch (reference.kind) {
      case "INSCRIPTION":
        return reference.paymentInstallmentId;
      case "ONSITE_REGISTRATION":
        return reference.onSiteRegistrationId;
      case "EVENT_EXPENSE":
        return reference.eventExpenseId;
      case "TICKET_SALE":
        return reference.ticketSaleId;
      case "UNKNOWN":
        return reference.id;
      default:
        return null;
    }
  })();

  const referenceKind = reference?.kind ?? null;

  const movimentDetails = (() => {
    if (!data) return null;
    const { reference: _, ...rest } = data;
    return rest;
  })();

  return {
    movimentDetails,
    reference,
    referenceKind,
    referenceId,
    loading: isLoading,
    error: error?.message || null,
    fetching: isFetched,
    refetch: async () => {
      await refetch();
    },
  };
}
