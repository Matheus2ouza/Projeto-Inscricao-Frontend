import { SaleGrupOutput, SaleGrupRequest } from "@/features/tickets/types/ticketSaleRegisterTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function registerTicketSaleGroup(
  payload: SaleGrupRequest
): Promise<SaleGrupOutput> {
  try {
    const { data } = await axiosInstance.post<SaleGrupOutput>(
      `/tickets/${payload.eventId}/sale-group`,
      payload
    );
    return data;

  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
      axiosError.message ??
      "Falha ao registrar a venda de tickets"
    );
  }
}
