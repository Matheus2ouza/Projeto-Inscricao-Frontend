import { useValidateExclusiveInscriptionLinkResult } from '@/features/inscriptions/types/exclusiveInscriptionLink/validateExclusiveInscriptionLink/validateExclusiveInscriptionLinkTypes';
import { useValidateExclusiveInscriptionLinkQuery } from './useValidateExclusiveInscriptionLinkQuery';

export function useValidateExclusiveInscriptionLink(
  token: string,
): useValidateExclusiveInscriptionLinkResult {
  const {
    previewQuery: {
      data,
      isLoading: previewIsLoading,
      isFetching: previewIsFetching,
      isFetched: previewIsFetched,
      error: previewError,
      refetch: refetchPreview,
    },
    validationQuery: {
      isLoading: validationIsLoading,
      isFetching: validationIsFetching,
      isFetched: validationIsFetched,
      error: validationError,
      refetch: refetchValidation,
    },
  } = useValidateExclusiveInscriptionLinkQuery(token);

  const loading = previewIsLoading || validationIsLoading;
  const fetching = previewIsFetching || validationIsFetching;
  const fetched = previewIsFetched && validationIsFetched;
  const error = previewError || validationError;

  return {
    event: data?.event || null,
    exclusiveInscriptionLink: data?.exclusiveInscriptionLink,
    status: data?.status ?? 'inactive',
    canInscribe: data?.canInscribe ?? false,
    loading,
    fetching,
    fetched,
    error: error || null,
    refresh: async () => {
      await Promise.all([refetchPreview(), refetchValidation()]);
    },
  };
}
