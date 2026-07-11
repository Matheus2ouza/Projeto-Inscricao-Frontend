import type { ListPreSalesResponse } from '@/features/tickets/types/list-sales/ticketListSalesTypes';
import { axiosClient } from '@/lib/axios';

type GetListPreSalesParams = {
  page: number;
  pageSize: number;
};

export async function getListPreSales(
  eventId: string,
  params: GetListPreSalesParams,
): Promise<ListPreSalesResponse> {
  try {
    const { data } = await axiosClient.get<ListPreSalesResponse>(
      `tickets/${eventId}/list`,
      { params },
    );

    return {
      event: data.event ?? null,
      total: data.total ?? 0,
      page: data.page ?? params.page,
      pageCount: data.pageCount ?? 1,
    };
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
        'Falha ao carregar a lista de vendas dos tickets.',
    );
  }
}
