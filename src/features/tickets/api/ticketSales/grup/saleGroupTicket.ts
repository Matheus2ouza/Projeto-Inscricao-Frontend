import type {
  SaleGroupTicketPayload,
  SaleGroupTicketResponse,
} from "@/features/tickets/types/ticketSales/grup/ticketSaleGroupTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function saleGroupTicket(
  sale: SaleGroupTicketPayload
): Promise<SaleGroupTicketResponse> {
  try {
    const { data } = await axiosInstance.post<SaleGroupTicketResponse>(
      "/tickets/sale/group",
      sale
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
