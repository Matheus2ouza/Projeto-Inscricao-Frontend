'use server';

import type { ListTypeInscriptionsToManagerResponse } from '@/features/typeInscription/types/listTypeInscriptionsToManager/listTypeInscriptionsManagerTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function listTypeInscriptionsToManagerService(
  eventId?: string,
): Promise<ListTypeInscriptionsToManagerResponse> {
  try {
    const { data } =
      await axiosServer.get<ListTypeInscriptionsToManagerResponse>(
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
