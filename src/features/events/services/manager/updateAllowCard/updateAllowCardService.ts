'use server';

import { Event } from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function updateAllowCardService(
  eventId: string,
  allowCard: boolean,
): Promise<Event> {
  try {
    const { data } = await axiosServer.put<Event>(
      `/events/${eventId}/allow-card`,
      {},
      {
        params: {
          allowCard,
        },
      },
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
          'Não foi possível atualizar a permissão de cartão no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível atualizar a permissão de cartão no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao atualizar permissão de cartão: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao atualizar a permissão de cartão. Tente novamente mais tarde.',
    );
  }
}
