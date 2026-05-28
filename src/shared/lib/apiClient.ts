import axios from 'axios';
import { toast } from 'sonner';

const baseURL =
  typeof window === 'undefined'
    ? (process.env.INTERNAL_API_URL ?? '')
    : (process.env.NEXT_PUBLIC_API_URL ?? '');

// LOG 1: Ver qual URL está sendo usada
console.log(
  '[apiClient] Environment:',
  typeof window === 'undefined' ? 'SERVER' : 'CLIENT',
);
console.log('[apiClient] Base URL:', baseURL);
console.log('[apiClient] INTERNAL_API_URL:', process.env.INTERNAL_API_URL);
console.log(
  '[apiClient] NEXT_PUBLIC_API_URL:',
  process.env.NEXT_PUBLIC_API_URL,
);

const axiosInstance = axios.create({
  baseURL,
  // Evita o adapter HTTP do Node (follow-redirects/url.parse) em SSR/RSC.
  // No browser continua usando XHR (default).
  adapter: typeof window === 'undefined' ? ['fetch', 'http'] : ['xhr'],
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

async function resolveAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    const { getAuthToken } = await import('./session');
    const token = await getAuthToken();
    return token;
  }
  try {
    // Primeiro tenta cookie direto
    const match = document.cookie.match(/(?:^|; )authToken=([^;]*)/);
    if (match) {
      console.log('[apiClient] resolveAuthToken (client): token from cookie');
      return decodeURIComponent(match[1]);
    }
    // Fallback: busca do endpoint interno (SSR/CSR)
    const res = await fetch('/web-api/token', { cache: 'no-store' });
    if (res.ok) {
      const { token } = await res.json();
      return token ?? null;
    }
    console.warn(
      '[apiClient] resolveAuthToken (client): /web-api/token request failed',
      res.status,
    );
    return null;
  } catch {
    console.error('[apiClient] resolveAuthToken: unexpected error');
    return null;
  }
}

// Interceptor de requisição para adicionar o token dinamicamente
axiosInstance.interceptors.request.use(
  async (config) => {
    const url = config.url ?? '';
    const isAuthFree =
      url.includes('/users/login') || url.includes('/users/refresh');

    // Busca o token atual apenas se não for login/refresh (server/client-safe)
    const token = isAuthFree ? null : await resolveAuthToken();

    // Adiciona o token no header Authorization se existir
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[apiClient] request interceptor error', error);
    return Promise.reject(error);
  },
);

// Interceptor de resposta para tratamento de erros
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Guard: se não houver config, não tenta tratar (ex: erro de rede/build estático)
    if (!originalRequest) {
      console.error(
        '[apiClient] response interceptor: error.config is undefined',
        error,
      );
      return Promise.reject(error);
    }

    // Evita loop: não tenta refresh se já for a chamada de refresh
    const isRefreshCall =
      originalRequest.url && originalRequest.url.includes('/users/refresh');

    if (error.response && error.response.status === 403 && !isRefreshCall) {
      console.warn(
        '[apiClient] response interceptor: 403 received, attempting refresh',
        {
          url: originalRequest.url,
          method: originalRequest.method,
          status: error.response.status,
        },
      );
      originalRequest.__retryCount = originalRequest.__retryCount || 0;
      if (originalRequest.__retryCount < 3) {
        originalRequest.__retryCount += 1;
        try {
          // Chama endpoint interno que faz refresh e atualiza cookie httpOnly
          const res = await fetch('/web-api/refresh', {
            method: 'POST',
            cache: 'no-store',
          });
          if (!res.ok) {
            console.error(
              '[apiClient] response interceptor: /web-api/refresh failed',
              res.status,
            );
            throw new Error('refresh failed');
          }
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error(
            '[apiClient] response interceptor: refresh sequence failed',
            refreshError,
          );
          // Logout e toast de sessão expirada
          try {
            await fetch('/web-api/logout', { method: 'POST' });
          } catch {}
          toast.error('Sessão expirada. Faça login novamente.');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
      }
    }
    console.error(
      '[apiClient] API Error:',
      error.response?.data || error.message || error,
    );
    return Promise.reject(error); // repassa o erro pra onde foi chamado
  },
);

export default axiosInstance;
