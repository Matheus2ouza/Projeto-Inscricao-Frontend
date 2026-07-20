'use server';

import {
  CreateMemberInput,
  CreateMemberResponse,
} from '@/features/members/types/createMember/createMemberTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function createMemberService(
  input: CreateMemberInput,
): Promise<CreateMemberResponse> {
  try {
    const { data } = await axiosServer.post<CreateMemberResponse>(
      `members/create`,
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
          'Não foi possível carregar os members no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível carregar os membros no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao buscar os membros: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao buscar os membros. Tente novamente mais tarde.',
    );
  }
}
