'use server';

import type { MembersResponse } from '@/features/members/types/membersCombobox/membersComboboxTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function membersComboboxService(
  eventId?: string,
  localityId?: string,
): Promise<MembersResponse> {
  try {
    const { data } = await axiosServer.get<MembersResponse>(
      `/members/${eventId}/all-names`,
      { params: { localityId } },
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
          'Não foi possível buscar os membros no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível buscar os membros no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao buscar membros: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao buscar os membros. Tente novamente mais tarde.',
    );
  }
}
