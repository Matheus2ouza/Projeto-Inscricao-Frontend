'use server';

import type { UpdateEventImageInput } from '@/features/events/types/manager/updateEventImage/updateEventImageTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function updateEventImageService(
  input: UpdateEventImageInput,
): Promise<void> {
  try {
    await axiosServer.patch(`/events/${input.eventId}/update/image`, {
      image: input.imageBase64,
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
          'Não foi possível atualizar a imagem do evento no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível atualizar a imagem do evento no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao atualizar imagem do evento: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao atualizar a imagem do evento. Tente novamente mais tarde.',
    );
  }
}
