'use server';

import type {
  ListEventsToInscriptionParams,
  ListEventsToInscriptionResponse,
} from '@/features/events/types/listEvents/listEventsToInscription/listEventsToInscriptionTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';
import qs from 'qs';

export async function listEventsToInscriptionService(
  params: ListEventsToInscriptionParams,
): Promise<ListEventsToInscriptionResponse> {
  try {
    const { data } = await axiosServer.get<ListEventsToInscriptionResponse>(
      '/events/inscriptions',
      {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          status: params.status,
        },
        paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
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
          'Não foi possível buscar os eventos para inscrição no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível buscar os eventos para inscrição no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao buscar eventos para inscrição: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao buscar os eventos para inscrição. Tente novamente mais tarde.',
    );
  }
}
