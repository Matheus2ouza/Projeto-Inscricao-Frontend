import type { PreSaleSchemaInput } from "@/features/tickets/schema/public/checkout/preSale.schema";
import type { PreSaleOutput } from "@/features/tickets/types/analysis/ticketsTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function createPreSale(
  payload: PreSaleSchemaInput
): Promise<PreSaleOutput> {
  try {
    const { data } = await axiosInstance.post<PreSaleOutput>(
      `/tickets/${payload.eventId}/pre-sale/`,
      payload
    );
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao registrar solicitação de compra dos tickets."
    );
  }
}
