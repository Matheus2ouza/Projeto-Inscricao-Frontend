import { useState } from "react";
import {
  RegisterPaymentDetailsParams,
  RegisterPaymentDetailsResult,
} from "../../types/registerPaymentDetails/registerPaymentDetails";
import {
  usePrefetchRegisterPaymentDetailsQuery,
  useRegisterPaymentDetailsQuery,
} from "./registerPaymentDetailsQuery";

export function useRegisterPaymentDetails({
  inscriptionId,
  initialPage = 1,
  pageSize = 20,
}: RegisterPaymentDetailsParams): RegisterPaymentDetailsResult {
  const [page, setPage] = useState(initialPage);

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useRegisterPaymentDetailsQuery(inscriptionId, page, pageSize);

  const { prefetchNextPage } = usePrefetchRegisterPaymentDetailsQuery();

  if (data && page < data.pageCount) {
    prefetchNextPage(inscriptionId, page, pageSize);
  }

  return {
    inscription: data?.inscription || null,
    participant: data?.participant || [],
    payments: data?.payments || [],
    allowCard: data?.allowCard || false,
    totalParticipant: data?.totalParticipant || 0,
    totalPayment: data?.totalPayment || 0,
    page,
    pageCount: data?.pageCount || 0,
    loading,
    error,
    setPage,
    refresh: async () => {
      await refetch();
    },
  };
}
