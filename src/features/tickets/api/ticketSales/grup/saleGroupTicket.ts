import type {
  SaleGroupTicketPayload,
  SaleGroupTicketResponse,
} from '@/features/tickets/types/ticketSales/grup/ticketSaleGroupTypes';
import { axiosClient } from '@/lib/axios';

export async function saleGroupTicket(
  sale: SaleGroupTicketPayload,
): Promise<SaleGroupTicketResponse> {
  try {
    const { data } = await axiosClient.post<SaleGroupTicketResponse>(
      '/tickets/$/sale/group',
      sale,
    );
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
        'Falha ao registrar venda em grupo do ticket',
    );
  }
}
