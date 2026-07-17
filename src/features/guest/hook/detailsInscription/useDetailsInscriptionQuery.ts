import { guestInscriptionDetailsAction } from '@/features/guest/actions/guestInscriptionDetails/guestInscriptionDetails';
import { GuestInscriptionDetailsResponse } from '@/features/guest/types/detailsInscription/detailsInscriptionType';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const detailsGuestInscriptionKeys = {
  all: ['details-guest-inscription'] as const,
  details: () => [...detailsGuestInscriptionKeys.all, 'detail'] as const,
  detail: (confirmationCode?: string) =>
    [...detailsGuestInscriptionKeys.details(), confirmationCode] as const,
};

export function useDetailsInscriptionQuery(confirmationCode?: string) {
  return useQuery<GuestInscriptionDetailsResponse>({
    queryKey: detailsGuestInscriptionKeys.detail(confirmationCode),
    queryFn: () => guestInscriptionDetailsAction(confirmationCode),
    enabled: !!confirmationCode,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateDetailsGuestInscriptionQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: detailsGuestInscriptionKeys.all,
      });
    },

    invalidateDetails: () => {
      queryClient.invalidateQueries({
        queryKey: detailsGuestInscriptionKeys.details(),
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: detailsGuestInscriptionKeys.details(),
      });
    },

    invalidateDetail: (confirmationCode: string) => {
      queryClient.invalidateQueries({
        queryKey: detailsGuestInscriptionKeys.detail(confirmationCode),
      });
    },

    removeAll: () => {
      queryClient.removeQueries({
        queryKey: detailsGuestInscriptionKeys.all,
      });
    },

    removeDetails: () => {
      queryClient.removeQueries({
        queryKey: detailsGuestInscriptionKeys.details(),
      });
    },

    removeDetail: (confirmationCode: string) => {
      queryClient.removeQueries({
        queryKey: detailsGuestInscriptionKeys.detail(confirmationCode),
      });
    },

    setDetailData: (confirmationCode: string, data: any) => {
      queryClient.setQueryData(
        detailsGuestInscriptionKeys.detail(confirmationCode),
        data,
      );
    },
  };
}
