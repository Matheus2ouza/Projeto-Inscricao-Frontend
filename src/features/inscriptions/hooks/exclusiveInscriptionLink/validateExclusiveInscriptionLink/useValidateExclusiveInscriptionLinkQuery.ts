import { useQuery, useQueryClient } from '@tanstack/react-query';
import { previewExclusiveLink } from '../../../api/exclusiveInscriptionLink/validateExclusiveInscriptionLink/previewExclusiveLink';
import { validateExclusiveLink } from '../../../api/exclusiveInscriptionLink/validateExclusiveInscriptionLink/validateExclusiveLink';

export const validateExclusiveInscriptionLinkKeys = {
  all: ['validateExclusiveInscriptionLink'] as const,
  validates: () =>
    [...validateExclusiveInscriptionLinkKeys.all, 'validate'] as const,
  validate: (token: string) =>
    [...validateExclusiveInscriptionLinkKeys.validates(), token] as const,
  validation: (token: string) =>
    [
      ...validateExclusiveInscriptionLinkKeys.validate(token),
      'validation',
    ] as const,
};

export function useValidateExclusiveInscriptionLinkQuery(token: string) {
  const previewQuery = useQuery({
    queryKey: validateExclusiveInscriptionLinkKeys.validate(token),
    queryFn: () => previewExclusiveLink(token),
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const validationQuery = useQuery({
    queryKey: validateExclusiveInscriptionLinkKeys.validation(token),
    queryFn: async () => {
      await validateExclusiveLink(token);
      return true;
    },
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    previewQuery,
    validationQuery,
  };
}

export function useInvalidateValidateExclusiveInscriptionLinkQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: validateExclusiveInscriptionLinkKeys.all,
      }),

    invalidateValidate: (token: string) =>
      queryClient.invalidateQueries({
        queryKey: validateExclusiveInscriptionLinkKeys.validate(token),
      }),
  };
}
