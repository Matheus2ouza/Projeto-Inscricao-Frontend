import { axiosServer } from '@/lib/axios/server';
import axios from 'axios';

export type RefreshTokenInput = {
  refreshToken: string;
};

export type RefreshTokenOutput = {
  authToken: string;
};

type RequestData = {
  refreshToken: string;
};

type RespondeErrorData = {
  statusCode: number;
  timeStamp: string;
  message: string;
};

type ResponseSuccessData = {
  authToken: string;
};

export async function refreshTokenService(
  input: RefreshTokenInput,
): Promise<RefreshTokenOutput> {
  try {
    const requestData: RequestData = {
      refreshToken: input.refreshToken,
    };

    const { data } = await axiosServer.post<ResponseSuccessData>(
      `/users/refresh`,
      requestData,
      { authToken: '' },
    );

    return {
      authToken: data.authToken,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { statusCode, timeStamp, message } = error.response
          .data as RespondeErrorData;

        console.error(`${timeStamp} - ${statusCode} - ${message}`);

        // Mensagem de negócio vinda da API (ex.: refresh token inválido ou expirado)
        throw new Error(message);
      }

      // A requisição foi enviada, mas o servidor não respondeu
      if (error.request) {
        console.error('Servidor indisponível ou sem resposta.');

        throw new Error(
          'Não foi possível renovar sua sessão no momento. Tente novamente mais tarde.',
        );
      }

      // Erro ao configurar a requisição
      console.error(error.message);

      throw new Error('Não foi possível iniciar a renovação da sessão.');
    }

    console.error(`Erro ao renovar o token de autenticação: ${error}`);

    throw new Error(
      'Ocorreu um erro inesperado ao renovar sua sessão. Tente novamente mais tarde.',
    );
  }
}
