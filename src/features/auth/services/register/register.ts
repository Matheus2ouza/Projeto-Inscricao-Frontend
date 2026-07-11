import { axiosClient } from '@/lib/axios';
import axios from 'axios';

export type RegisterServiceInput = {
  email: string;
  password: string;
};

export type RegisterServiceOutput = {
  message: string;
};

type RequestData = {
  email: string;
  password: string;
};

type RespondeErrorData = {
  statusCode: number;
  timeStamp: string;
  message: string;
};

export async function registerService(
  input: RegisterServiceInput,
): Promise<RegisterServiceOutput> {
  try {
    const data: RequestData = {
      email: input.email,
      password: input.password,
    };

    await axiosClient.post('/users', data);

    return {
      message: 'Usuario Registrado!',
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
