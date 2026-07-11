'use server';

import type { ListTypeInscriptionsResponse } from '@/features/typeInscription/types/listTypeInscriptions/listTypeInscriptionsTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function listTypeInscriptionsService(
  eventId: string,
): Promise<ListTypeInscriptionsResponse> {
  try {
    const { data } = await axiosServer.get<ListTypeInscriptionsResponse>(
      `/type-inscription/event/${eventId}`,
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
          'Não foi possível buscar os tipos de inscrição no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível buscar os tipos de inscrição no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao buscar tipos de inscrição: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao buscar os tipos de inscrição. Tente novamente mais tarde.',
    );
  }
}
