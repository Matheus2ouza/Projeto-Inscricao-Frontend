import { axiosClient } from '@/lib/axios/';
import type { EventsListResponse } from '../../inscriptions/types/listEventsTypes';

export type getEventsForTicketParams = {
  page: number;
  pageSize: number;
};

export async function getEventsForTicket(
  params: getEventsForTicketParams,
): Promise<EventsListResponse> {
  const { data } = await axiosClient.get<EventsListResponse>(
    '/events/tickets',
    {
      params: {
        page: params.page,
        pageSize: params.pageSize,
      },
    },
  );

  return data;
}
