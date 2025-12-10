import { FindTicketsForSaleOutput } from "@/features/tickets/types/ticketSaleRegisterTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function getTicketsForSale(
  eventId: string
): Promise<FindTicketsForSaleOutput> {
  try {
    const { data } = await axiosInstance.get<FindTicketsForSaleOutput>(
      `/tickets/public/${eventId}`
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
      "Falha ao carregar os tickets para venda"
    );
  }
}
