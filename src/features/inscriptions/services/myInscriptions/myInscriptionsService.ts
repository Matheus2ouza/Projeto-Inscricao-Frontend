'use server';

import { MyInscriptionsResponse } from '@/features/inscriptions/types/myInscriptions/myInscriptionsTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function myInscriptionsService(
  eventId: string,
  page: number = 0,
  pageSize: number = 10,
  localityId?: string,
  limitTime?: string,
): Promise<MyInscriptionsResponse> {
  try {
    const { data } = await axiosServer.get<MyInscriptionsResponse>(
      `/inscriptions/${eventId}`,
      {
        params: {
          page,
          pageSize,
          localityId,
          limitTime,
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
          'Não foi possível buscar as inscrições no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível buscar as inscrições no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao buscar inscrições: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao buscar as inscrições. Tente novamente mais tarde.',
    );
  }
}
