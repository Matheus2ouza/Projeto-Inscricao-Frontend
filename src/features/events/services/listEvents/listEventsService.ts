'use server';

import {
  ListEventsResponse,
  StatusEvent,
} from '@/features/events/types/listEvents/listEventsTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function listEventsService(params: {
  page: number;
  pageSize: number;
  status?: StatusEvent[];
}): Promise<ListEventsResponse> {
  try {
    const { data } = await axiosServer.get<ListEventsResponse>('/events', {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        status: params.status,
      },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { statusCode, timeStamp, message } = error.response
          .data as RespondeErrorData;

        console.error(`${timeStamp} - ${statusCode} - ${message}`);

        // Mensagem de negócio vinda da API (ex.: refresh token inválido ou expirado)
        throw new Error(message);
      }

      // A requisição foi enviada, mas o servidor não respondeu
      if (error.request) {
        console.error('Servidor indisponível ou sem resposta.');

        throw new Error(
          'Não foi possível buscar os eventos no momento. Tente novamente mais tarde.',
        );
      }

      // Erro ao configurar a requisição
      console.error(error.message);

      throw new Error(
        'Não foi possível buscar os eventos no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao renovar o token de autenticação: ${error}`);

    throw new Error(
      'Ocorreu um erro inesperado ao tentar buscar os eventos. Tente novamente mais tarde.',
    );
  }
}
