import axiosInstance from "@/shared/lib/apiClient";
import type {
  SaleGroupTicketPayload,
  SaleGroupTicketResponse,
} from "../types/ticketSaleGroupTypes";

export async function saleGroupTicket(
  payload: SaleGroupTicketPayload
): Promise<SaleGroupTicketResponse> {
  try {
    const { data } = await axiosInstance.post<SaleGroupTicketResponse>(
      "/tickets/sale/group",
      payload
    );
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao registrar venda em grupo do ticket"
    );
  }
}
