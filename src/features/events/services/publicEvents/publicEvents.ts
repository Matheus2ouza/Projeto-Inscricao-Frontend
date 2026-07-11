import { Event } from '@/features/events/types/publicEvents/publicEventsTypes';
import { axiosServer, type RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function publiEventsService(): Promise<Event[]> {
  try {
    const { data } = await axiosServer.get<Event[]>('/events/carousel');

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { statusCode, timeStamp, message } = error.response
          .data as RespondeErrorData;

        console.error(`${timeStamp} - ${statusCode} - ${message}`);

        // Mensagem de negócio vinda da API (ex.: refresh token inválido ou expirado)
        return [];
      }

      // A requisição foi enviada, mas o servidor não respondeu
      if (error.request) {
        console.error('Servidor indisponível ou sem resposta.');

        return [];
      }

      // Erro ao configurar a requisição
      console.error(error.message);

      return [];
    }

    console.error(`Erro ao renovar o token de autenticação: ${error}`);

    return [];
  }
}
