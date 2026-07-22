import { axiosServer } from '@/lib/axios/server';
import axios from 'axios';

export type UserDataServiceInput = {
  authToken: string;
};

export type UserDataServiceOutput = {
  id: string;
  username: string;
  role: string;
  email?: string;
  regionId?: string;
};

type RespondeErrorData = {
  statusCode: number;
  timeStamp: string;
  message: string;
};

export async function userDataService(
  input: UserDataServiceInput,
): Promise<UserDataServiceOutput> {
  try {
    const { data } = await axiosServer.get<UserDataServiceOutput>('/users/me', {
      authToken: input.authToken,
    });

    return {
      id: data.id,
      username: data.username,
      role: data.role,
      email: data.email,
      regionId: data.regionId,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { statusCode, timeStamp, message } = error.response
          .data as RespondeErrorData;

        console.error(`${timeStamp} - ${statusCode} - ${message}`);

        throw new Error(message);
      }

      // A requisição foi enviada, mas não houve resposta
      if (error.request) {
        console.error('Servidor indisponível ou sem resposta.');

        throw new Error('Servidor indisponível. Tente novamente mais tarde.');
      }

      // Erro ao montar a requisição
      console.error(error.message);

      throw new Error('Erro ao realizar a requisição.');
    }

    console.error(error);

    throw new Error('Erro inesperado. Tente novamente mais tarde.');
  }
}
