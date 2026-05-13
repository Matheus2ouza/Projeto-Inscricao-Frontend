'use client';

import { useGlobalLoading } from '@/components/GlobalLoading';
import { RegisterExclusiveInscriptionLinkSchemaType } from '@/features/inscriptions/schema/exclusiveInscriptionLink/registerInscriptionLink/registerInscriptionLinkSchema';
import { RegisterInscriptionLinkResponse } from '@/features/inscriptions/types/exclusiveInscriptionLink/registerInscriptionLink/registerInscriptionLinkTypes';
import { toast } from 'sonner';
import { useRegisterExclusiveInscriptionLink } from './useRegisterExclusiveInscriptionLink';

export type UseCreateExclusiveInscriptionLink = {
  initialValues: RegisterExclusiveInscriptionLinkSchemaType;
  submit: (values: RegisterExclusiveInscriptionLinkSchemaType) => Promise<{
    success?: {
      id: string;
      status: RegisterInscriptionLinkResponse['status'];
      confirmationCode: string;
    };
    error?: string;
  }>;
};

export function useFormCreateExclusiveInscriptionLink(
  eventId: string,
  exclusiveInscriptionLink: string,
): UseCreateExclusiveInscriptionLink {
  const { setLoading } = useGlobalLoading();
  const mutation = useRegisterExclusiveInscriptionLink();
  const today = new Date().toISOString().slice(0, 10);

  const initialValues: RegisterExclusiveInscriptionLinkSchemaType = {
    name: '',
    preferredName: '',
    email: '',
    phone: '',
    cpf: '',
    gender: 'MASCULINO',
    locality: '',
    birthDate: today,
    observation: '',
    termsAccepted: false,
    typeInscriptionId: '',
  };

  async function submit(values: RegisterExclusiveInscriptionLinkSchemaType) {
    setLoading(true);

    try {
      const response = await mutation.mutateAsync({
        ...values,
        eventId,
        exclusiveInscriptionLink,
      });

      return {
        success: {
          id: response.id,
          status: response.status,
          confirmationCode: response.confirmationCode,
        },
      };
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  }

  return {
    initialValues,
    submit,
  };
}
