import { registerInscriptionLink } from '@/features/inscriptions/api/exclusiveInscriptionLink/registerInscriptionLink/registerInscriptionLink';
import {
  RegisterInscriptionLinkInput,
  RegisterInscriptionLinkResponse,
} from '@/features/inscriptions/types/exclusiveInscriptionLink/registerInscriptionLink/registerInscriptionLinkTypes';
import { useMutation } from '@tanstack/react-query';
import { useInvalidateValidateExclusiveInscriptionLinkQuery } from '../validateExclusiveInscriptionLink/useValidateExclusiveInscriptionLinkQuery';

export function useRegisterExclusiveInscriptionLink() {
  const { invalidateAll } =
    useInvalidateValidateExclusiveInscriptionLinkQuery();

  return useMutation<
    RegisterInscriptionLinkResponse,
    Error,
    RegisterInscriptionLinkInput
  >({
    mutationFn: (payload) => registerInscriptionLink(payload),
    onSuccess: () => {
      invalidateAll();
    },
  });
}
