import axios from 'axios';
import { getSession } from 'next-auth/react';

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.authToken) {
      config.headers.Authorization = `Bearer ${session.authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
