'use server';

import { axiosServer, type RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';
import type { FindEventDateResponse } from '../../types/eventsDatesTypes';

export async function eventsDatesService(): Promise<FindEventDateResponse> {
  try {
    const { data } =
      await axiosServer.get<FindEventDateResponse>('/events/dates');
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { statusCode, timeStamp, message } = error.response
          .data as RespondeErrorData;

        console.error(`${timeStamp} - ${statusCode} - ${message}`);

        return { events: [] };
      }

      // A requisição foi enviada, mas o servidor não respondeu
      if (error.request) {
        console.error('Servidor indisponível ou sem resposta.');

        return { events: [] };
      }

      // Erro ao configurar a requisição
      console.error(error.message);

      return { events: [] };
    }

    console.error(`Erro ao buscar datas dos eventos: ${error}`);

    return { events: [] };
  }
}
