import { refreshTokenService } from '@/features/auth/services';
import { JWT } from 'next-auth/jwt';

let refreshPromise: Promise<JWT> | null = null;

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await refreshTokenService({
      refreshToken: token.refreshToken!,
    });

    return {
      ...token,
      authToken: response.authToken,
      error: undefined,
    };
  } catch (error) {
    console.error('Erro ao renovar token:', error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export async function refreshAccessTokenWithLock(token: JWT): Promise<JWT> {
  refreshPromise = refreshAccessToken(token).finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}
