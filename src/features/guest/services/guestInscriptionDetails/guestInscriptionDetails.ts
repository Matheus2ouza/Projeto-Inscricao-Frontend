'use server';

import { GuestInscriptionDetailsResponse } from '@/features/guest/types/detailsInscription/detailsInscriptionType';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function guestInscriptionDetailsService(
  confirmationCode?: string,
): Promise<GuestInscriptionDetailsResponse> {
  try {
    const { data } = await axiosServer.get<GuestInscriptionDetailsResponse>(
      `inscription/guest/${confirmationCode}/details`,
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
          'Não foi possível carregar os detalhes da inscrição no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível carregar os detalhes da inscrição no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao buscar detalhes do evento: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado os buscar detalhes da inscrição. Tente novamente mais tarde.',
    );
  }
}
