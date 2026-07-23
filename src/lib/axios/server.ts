import { nextAuthOptions } from '@/features/auth/configs/nextAuthOptions';
import axios, { AxiosRequestConfig } from 'axios';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';

type AxiosServerConfig = AxiosRequestConfig & {
  authToken?: string;
};

export type RespondeErrorData = {
  statusCode: number;
  timeStamp: string;
  message: string;
  incompleteMembers?: {
    accountParticipantId: string;
    missingFields: string[];
  }[];
};

const instance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 60000, // 60 segundos como padrão seguro
  headers: {
    'Content-Type': 'application/json',
  },
});

async function withHeaders(config: AxiosServerConfig = {}) {
  const cookieStore = await cookies();
  const { authToken, headers, ...rest } = config;

  const resolvedAuthToken =
    authToken !== undefined
      ? authToken
      : (await getServerSession(nextAuthOptions))?.authToken;

  return {
    ...rest,
    headers: {
      Cookie: cookieStore.toString(),
      ...headers,
      ...(resolvedAuthToken && {
        Authorization: `Bearer ${resolvedAuthToken}`,
      }),
    },
  };
}

export const axiosServer = {
  async get<T>(url: string, config: AxiosServerConfig = {}) {
    return instance.get<T>(url, await withHeaders(config));
  },

  async post<T>(url: string, data?: unknown, config: AxiosServerConfig = {}) {
    return instance.post<T>(url, data, await withHeaders(config));
  },

  async put<T>(url: string, data?: unknown, config: AxiosServerConfig = {}) {
    return instance.put<T>(url, data, await withHeaders(config));
  },

  async patch<T>(url: string, data?: unknown, config: AxiosServerConfig = {}) {
    return instance.patch<T>(url, data, await withHeaders(config));
  },

  async delete<T>(url: string, config: AxiosServerConfig = {}) {
    return instance.delete<T>(url, await withHeaders(config));
  },
};
