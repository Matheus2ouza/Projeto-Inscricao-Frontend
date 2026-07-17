'use server';

import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';
import { EventDetailsToGuestInscriptionResponse } from '../../types/guestInscription/eventDetailsToGuestInscriptionTypes';

export async function eventDetailsToGuestInscriptionService(
  eventId?: string,
): Promise<EventDetailsToGuestInscriptionResponse> {
  try {
    const { data } =
      await axiosServer.get<EventDetailsToGuestInscriptionResponse>(
        `events/${eventId}/details`,
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
