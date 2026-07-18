'use server';

import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';
import { ListLocalitiesResponse } from '../../types/listLocalities/listLocalitiesTypes';

export async function listLocalitiesService(): Promise<ListLocalitiesResponse> {
  try {
    const { data } =
      await axiosServer.get<ListLocalitiesResponse>(`locality/all`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { statusCode, timeStamp, message } = error.response
          .data as RespondeErrorData;

        console.error(`${timeStamp} - ${statusCode} - ${message}`);

        return [];
      }

      if (error.request) {
        console.error('Servidor indisponível ou sem resposta.');
        throw new Error(
          'Não foi possível buscar a lista de localidades no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      return [];
    }

    console.error(`Erro ao buscar tipos de inscrição: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao buscar a lista de localidades. Tente novamente mais tarde.',
    );
  }
}
