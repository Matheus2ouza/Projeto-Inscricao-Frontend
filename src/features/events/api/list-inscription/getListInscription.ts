import { axiosClient } from '@/lib/axios';
import { FindAccountWithInscriptionsResponse } from '../../types/eventTypes';

export async function getListInscription(
  eventId: string,
): Promise<FindAccountWithInscriptionsResponse> {
  try {
    const { data } = await axiosClient.get<FindAccountWithInscriptionsResponse>(
      `/events/${eventId}/list-inscription`,
    );
    return data;
  } catch (error) {
    console.error('Error fetching list inscriptions:', error);
    throw new Error('Falha ao carregar lista de inscrições');
  }
}
