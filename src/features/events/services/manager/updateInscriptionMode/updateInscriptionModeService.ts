'use server';

import { InscriptionMode } from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function updateInscriptionModeService(
  eventId: string,
  inscriptionMode: InscriptionMode[],
) {
  try {
    await axiosServer.patch(`events/${eventId}/update/inscription-mode`, {
      inscriptionMode,
    });
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
          'Não foi possível atualizar os métodos de inscrição do evento no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível atualizar os métodos de inscrição do evento no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao atualizar logo do evento: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao atualizar os métodos de inscrição do evento. Tente novamente mais tarde.',
    );
  }
}
