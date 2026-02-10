import axios from "axios";
import { toast } from "sonner";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

async function resolveAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    const { getAuthToken } = await import("./session");
    const token = await getAuthToken();
    return token;
  }
  try {
    // Primeiro tenta cookie direto
    const match = document.cookie.match(/(?:^|; )authToken=([^;]*)/);
    if (match) {
      console.log("[apiClient] resolveAuthToken (client): token from cookie");
      return decodeURIComponent(match[1]);
    }
    // Fallback: busca do endpoint interno (SSR/CSR)
    const res = await fetch("/api/token", { cache: "no-store" });
    if (res.ok) {
      const { token } = await res.json();
      return token ?? null;
    }
    console.warn(
      "[apiClient] resolveAuthToken (client): /api/token request failed",
      res.status,
    );
    return null;
  } catch {
    console.error("[apiClient] resolveAuthToken: unexpected error");
    return null;
  }
}

// Interceptor de requisição para adicionar o token dinamicamente
axiosInstance.interceptors.request.use(
  async (config) => {
    const url = config.url ?? "";
    const isAuthFree =
      url.includes("/users/login") || url.includes("/users/refresh");

    // Busca o token atual apenas se não for login/refresh (server/client-safe)
    const token = isAuthFree ? null : await resolveAuthToken();

    // Adiciona o token no header Authorization se existir
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("[apiClient] request interceptor error", error);
    return Promise.reject(error);
  },
);

// Interceptor de resposta para tratamento de erros
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Evita loop: não tenta refresh se já for a chamada de refresh
    const isRefreshCall =
      originalRequest.url && originalRequest.url.includes("/users/refresh");
    if (error.response && error.response.status === 403 && !isRefreshCall) {
      console.warn(
        "[apiClient] response interceptor: 403 received, attempting refresh",
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
          const res = await fetch("/api/refresh", {
            method: "POST",
            cache: "no-store",
          });
          if (!res.ok) {
            console.error(
              "[apiClient] response interceptor: /api/refresh failed",
              res.status,
            );
            throw new Error("refresh failed");
          }
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error(
            "[apiClient] response interceptor: refresh sequence failed",
            refreshError,
          );
          // Logout e toast de sessão expirada
          try {
            await fetch("/api/logout", { method: "POST" });
          } catch {}
          toast.error("Sessão expirada. Faça login novamente.");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }
      }
    }
    console.error(
      "[apiClient] API Error:",
      error.response?.data || error.message || error,
    );
    return Promise.reject(error); // repassa o erro pra onde foi chamado
  },
);

export default axiosInstance;
