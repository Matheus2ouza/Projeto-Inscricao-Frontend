'use server';

import axiosInstance from '@/shared/lib/apiClient';
import { isProd } from '@/shared/lib/utils';
import { cookies } from 'next/headers';
import {
  AuthResponse,
  AxiosError,
  LoginServiceInput,
  RequestData,
  SessionData,
  User,
} from '../types/loginTypes';

export type LoginServiceResult =
  | { ok: true; user: User }
  | { ok: false; errorMessage: string };

// Serviço de login
export async function loginService(
  input: LoginServiceInput,
): Promise<LoginServiceResult> {
  const dataToRequest: RequestData = {
    username: input.username,
    password: input.password,
  };

  try {
    const { data } = await axiosInstance.post<AuthResponse>(
      '/users/',
      dataToRequest,
    );

    const { authToken, refreshToken, user } = data;

    const sessionData: SessionData = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        region: user.role === 'SUPER' ? null : user.region,
        image: user.image,
      },
    };

    const cookieStore = await cookies();

    cookieStore.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: isProd,
      path: '/',
      maxAge: 60 * 60 * 7, // 7 horas
    });

    cookieStore.set('authToken', authToken, {
      httpOnly: true,
      secure: isProd,
      path: '/',
      maxAge: 60 * 60 * 7,
    });

    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      path: '/',
      maxAge: 60 * 60 * 7,
    });

    return { ok: true, user: sessionData.user };
  } catch (error: unknown) {
    const axiosError = error as AxiosError;

    const errorMessage =
      axiosError.response?.data?.message ||
      'Erro inesperado. Por favor, tente novamente mais tarde.';

    return { ok: false, errorMessage };
  }
}
