import { axiosServer } from '@/lib/axios/server';
import axios from 'axios';

export type LoginServiceInput = {
  username: string;
  password: string;
};

export type LoginServiceOutput = {
  authToken: string;
  refreshToken: string;
};

type RequestData = {
  username: string;
  password: string;
};

type RespondeErrorData = {
  statusCode: number;
  timeStamp: string;
  message: string;
};

type ResponseSuccessData = {
  authToken: string;
  refreshToken: string;
};

export async function loginService(
  input: LoginServiceInput,
): Promise<LoginServiceOutput> {
  try {
    const requestData: RequestData = {
      username: input.username,
      password: input.password,
    };

    const { data } = await axiosServer.post<ResponseSuccessData>(
      `/users/login`,
      requestData,
    );

    return {
      authToken: data.authToken,
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { statusCode, timeStamp, message } = error.response
          .data as RespondeErrorData;

        console.error(`${timeStamp} - ${statusCode} - ${message}`);

        // Mensagem de negócio vinda da API (ex.: credenciais inválidas)
        throw new Error(message);
      }

      // A requisição foi enviada, mas o servidor não respondeu
      if (error.request) {
        console.error('Servidor indisponível ou sem resposta.');

        throw new Error(
          'Não foi possível realizar o login no momento. Tente novamente mais tarde.',
        );
      }

      // Erro ao configurar a requisição
      console.error(error.message);

      throw new Error('Não foi possível iniciar a solicitação de login.');
    }

    console.error(`Error ao realizar login do user: ${error}`);

    throw new Error(
      'Ocorreu um erro inesperado ao realizar o login. Tente novamente mais tarde.',
    );
  }
}
