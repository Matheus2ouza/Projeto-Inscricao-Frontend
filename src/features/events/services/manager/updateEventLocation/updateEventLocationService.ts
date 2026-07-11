'use server';

import type { UpdateEventLocationInput } from '@/features/events/types/manager/updateEventLocation/updateEventLocationTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function updateEventLocationService(
  input: UpdateEventLocationInput,
): Promise<void> {
  try {
    await axiosServer.patch(`/events/${input.eventId}/update/location`, {
      location: input.location,
      latitude: input.latitude,
      longitude: input.longitude,
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
          'Não foi possível atualizar a localização do evento no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível atualizar a localização do evento no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao atualizar localização do evento: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao atualizar a localização do evento. Tente novamente mais tarde.',
    );
  }
}
