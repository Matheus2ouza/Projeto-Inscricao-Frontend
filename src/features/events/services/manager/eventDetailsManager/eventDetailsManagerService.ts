'use server';

import type { EventDetailsManagerResponse } from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function eventDetailsManagerService(
  eventId?: string,
): Promise<EventDetailsManagerResponse> {
  try {
    const { data } = await axiosServer.get<EventDetailsManagerResponse>(
      `/events/${eventId}`,
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { statusCode, timeStamp, message } = error.response
          .data as RespondeErrorData;

        console.error(`${timeStamp} - ${statusCode} - ${message}`);

        throw new Error(message);
      }

      if (error.request) {
        console.error('Servidor indisponível ou sem resposta.');
        throw new Error(
          'Não foi possível carregar os detalhes do evento no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível carregar os detalhes do evento no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao buscar detalhes do evento: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao buscar os detalhes do evento. Tente novamente mais tarde.',
    );
  }
}
