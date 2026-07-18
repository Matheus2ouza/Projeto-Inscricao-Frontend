'use client';

import {
  getUsers,
  type GetUsersResponse,
  type UserDto,
} from '@/features/accounts/api/getUsers';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// Chaves de cache para usuários (padrão similar a events)
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) =>
    [...usersKeys.lists(), { page, pageSize }] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};

type UseUsersParams = {
  initialPage?: number;
  pageSize?: number;
};

type UseUsersResult = {
  users: UserDto[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
};

export function useUsers({
  initialPage = 1,
  pageSize = 20,
}: UseUsersParams = {}): UseUsersResult {
  const [page, setPage] = useState(initialPage);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: usersKeys.list(page, pageSize),
    queryFn: async (): Promise<GetUsersResponse> =>
      await getUsers({ page, pageSize }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Pré-carregar próxima página quando possível
  if (data && page < (data.pageCount ?? 0)) {
    void queryClient.prefetchQuery({
      queryKey: usersKeys.list(page + 1, pageSize),
      queryFn: async () => await getUsers({ page: page + 1, pageSize }),
      staleTime: 5 * 60 * 1000,
    });
  }

  return {
    users: data?.users ?? [],
    total: data?.total ?? 0,
    page,
    pageCount: data?.pageCount ?? 0,
    loading: isLoading,
    error: (error as Error | null)?.message ?? null,
    setPage,
    refetch: async () => {
      await refetch();
    },
  };
}
