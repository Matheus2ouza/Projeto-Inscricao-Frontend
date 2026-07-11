'use server';

import type {
  UpdateEventInscriptionsInput,
  UpdateEventInscriptionsResponse,
} from '@/features/events/types/manager/updateEventInscriptions/updateEventInscriptionsTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function updateEventInscriptionsService(
  input: UpdateEventInscriptionsInput,
): Promise<UpdateEventInscriptionsResponse> {
  try {
    const { data } = await axiosServer.patch<UpdateEventInscriptionsResponse>(
      `/events/${input.eventId}/update/inscriptions`,
      { status: input.status },
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
          'Não foi possível atualizar o status das inscrições no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível atualizar o status das inscrições no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao atualizar status das inscrições: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao atualizar o status das inscrições. Tente novamente mais tarde.',
    );
  }
}
