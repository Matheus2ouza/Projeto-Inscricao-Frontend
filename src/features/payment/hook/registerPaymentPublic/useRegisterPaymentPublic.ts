import {
  RegisterPaymentPublicParams,
  RegisterPaymentPublicResult,
} from "../../types/registerPaymentPublic/registerPaymentPublicType";
import { useRegisterPaymentPublicQuery } from "./useRegisterPaymentPublicQuery";

export function useRegisterPaymentPublic({
  eventId,
}: RegisterPaymentPublicParams): RegisterPaymentPublicResult {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useRegisterPaymentPublicQuery(eventId);

  return {
    event: data || null,
    loading,
    error,
    refresh: async () => {
      await refetch();
    },
  };
}
