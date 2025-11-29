import axiosInstance from "@/shared/lib/apiClient";
import type {
  FindTicketDetailsResponse,
  TicketDetails,
} from "../types/ticketsTypes";

export async function getTicketSalesDetails(
  ticketId: string
): Promise<TicketDetails> {
  try {
    const { data } = await axiosInstance.get<FindTicketDetailsResponse>(
      `/tickets/${ticketId}/details`
    );

    return {
      id: data.id,
      name: data.name,
      description: data.description || "",
      quantity: data.quantity,
      price: data.price,
      available: data.available,
      expirationDate: String(data.expirationDate),
      isActive: data.isActive,
      ticketSaleItems:
        data.TicketSaleItens?.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          createdAt: String(item.createdAt),
        })) ?? [],
    };
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
        "Falha ao carregar detalhes de vendas do ticket"
    );
  }
}
