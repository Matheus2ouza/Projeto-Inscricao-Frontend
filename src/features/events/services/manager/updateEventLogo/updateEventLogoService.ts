'use server';

import type { UpdateEventLogoInput } from '@/features/events/types/manager/updateEventLogo/updateEventLogoTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';
import FormData from 'form-data';

export async function updateEventLogoService(
  input: UpdateEventLogoInput,
): Promise<void> {
  try {
    const buffer = Buffer.from(await input.file.arrayBuffer());

    const formData = new FormData();
    formData.append('file', buffer, {
      filename: input.file.name,
      contentType: input.file.type,
    });

    await axiosServer.patch(`/events/${input.eventId}/update/logo`, formData, {
      headers: formData.getHeaders(),
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
          'Não foi possível atualizar o logo do evento no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível atualizar o logo do evento no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao atualizar logo do evento: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao atualizar o logo do evento. Tente novamente mais tarde.',
    );
  }
}
