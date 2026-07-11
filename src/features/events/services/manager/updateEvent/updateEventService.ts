'use server';

import type {
  UpdateEventInput,
  UpdateEventResponse,
} from '@/features/events/types/manager/updateEvent/updateEventTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function updateEventService(
  eventId: string,
  input: UpdateEventInput,
): Promise<UpdateEventResponse> {
  try {
    const { data } = await axiosServer.put<UpdateEventResponse>(
      `/events/${eventId}`,
      input,
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
          'Não foi possível atualizar o evento no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível atualizar o evento no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao atualizar evento: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao atualizar o evento. Tente novamente mais tarde.',
    );
  }
}
