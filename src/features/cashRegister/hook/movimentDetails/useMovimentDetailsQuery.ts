import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMovimentDetails } from '../../api/movimentDetails/movimentDetails';
import { MovimentDetailsResponse } from '../../types/movimentDetails/movimentDetailsTypes';

export const movimentDetailsKeys = {
  all: ['moviment-details'] as const,
  details: () => [...movimentDetailsKeys.all, 'detail'] as const,
  detail: (movimentId: string) =>
    [...movimentDetailsKeys.details(), movimentId] as const,
};

export function useMovimentDetailsQuery(movimentId: string) {
  return useQuery<MovimentDetailsResponse>({
    queryKey: movimentDetailsKeys.detail(movimentId),
    queryFn: () => getMovimentDetails({ movimentId }),
    enabled: Boolean(movimentId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateMovimentDetailQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: movimentDetailsKeys.all,
      });
    },
    invalidateDetails: () => {
      queryClient.invalidateQueries({
        queryKey: movimentDetailsKeys.details(),
      });
    },
    invalidateDetail: (movimentId: string) => {
      queryClient.invalidateQueries({
        queryKey: movimentDetailsKeys.detail(movimentId),
      });
    },
    removeAll: () => {
      queryClient.removeQueries({
        queryKey: movimentDetailsKeys.all,
      });
    },
    removeDetails: () => {
      queryClient.removeQueries({
        queryKey: movimentDetailsKeys.details(),
      });
    },
    removeDetail: (movimentId: string) => {
      queryClient.removeQueries({
        queryKey: movimentDetailsKeys.detail(movimentId),
      });
    },
  };
}
