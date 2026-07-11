import { axiosClient } from '@/lib/axios';
import { TicketsByEventResponse } from '../../types/analysis/ticketsTypes';

export async function getTicketsByEvent(
  eventId: string,
): Promise<TicketsByEventResponse> {
  try {
    const { data } = await axiosClient.get<TicketsByEventResponse>(
      `/tickets/${eventId}/`,
    );
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
        'Falha ao carregar tickets do evento',
    );
  }
}
