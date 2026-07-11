'use server';

import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function deleteEventService(eventId: string): Promise<void> {
  try {
    await axiosServer.delete(`/events/${eventId}`);
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
          'Não foi possível deletar o evento no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível deletar o evento no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao deletar evento: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao deletar o evento. Tente novamente mais tarde.',
    );
  }
}
