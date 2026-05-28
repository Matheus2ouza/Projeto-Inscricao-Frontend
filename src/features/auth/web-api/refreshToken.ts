'use server';

import axiosInstance from '@/shared/lib/apiClient';
import { getRefreshToken } from '@/shared/lib/getRefreshToken';
import { isProd } from '@/shared/lib/utils';
import { cookies } from 'next/headers';

// Tenta atualizar o token chamando o endpoint externo /users/refresh
export async function useRefreshToken(): Promise<boolean> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      console.error('Refresh token não encontrado nos cookies.');
      return false;
    }
    const response = await axiosInstance.post('/users/refresh', {
      refreshToken,
    });
    const { authToken } = response.data;

    try {
      const cookieStore = await cookies();
      cookieStore.set('authToken', authToken, {
        httpOnly: true,
        secure: isProd,
        path: '/',
        maxAge: 60 * 60 * 7, // 7 horas
      });
    } catch (err) {
      console.error('Erro ao salvar novo authToken no cookie:', err);
    }

    return true;
  } catch (error) {
    console.error('Erro ao tentar refresh token:', error);
    return false;
  }
}
