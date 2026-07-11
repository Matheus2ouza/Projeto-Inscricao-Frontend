import { axiosClient } from '@/lib/axios';

export type ApprovePreSalePayload = {
  ticketSalesId: string;
};

export async function rejectPreSale(payload: ApprovePreSalePayload) {
  try {
    const { ticketSalesId } = payload;
    const { data } = await axiosClient.post(`tickets/${ticketSalesId}/reject`, {
      ticketSalesId,
    });
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message || 'Falha ao rejeitar a pré-venda.',
    );
  }
}
