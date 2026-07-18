'use client';

import { useGlobalLoading } from '@/components/GlobalLoading';
import {
  buildGuestInscriptionSchema,
  GuestInscriptionSchemaType,
} from '@/features/guest/schema/guestInscription/guestInscriptionSchema';
import { ParticipantFieldsConfig } from '@/features/guest/types/guestInscription/eventDetailsToGuestInscriptionTypes';
import { InscriptionStatus } from '@/features/guest/types/guestInscription/registerGuesInscriptionTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { registerGuestInscriptionAction } from '../../actions/registerGuestInscription/registerGuestInscription';
import { useInvalidateEventDetailsToGuestInscriptionQuery } from './useEventDetailsToGuestInscriptionQuery';

export type UseFormRegisterGuestInscriptionType = {
  form: ReturnType<typeof useForm<GuestInscriptionSchemaType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<
    | {
        id: string;
        status: InscriptionStatus;
        confirmationCode: string;
        expiresAt: string;
      }
    | undefined
  >;
  isLoading: boolean;
};

export function useFormRegisterGuestInscription(
  eventId: string,
  participantFieldsConfig: ParticipantFieldsConfig,
): UseFormRegisterGuestInscriptionType {
  const { setLoading } = useGlobalLoading();
  const [isLoading, setIsLoading] = React.useState(false);
  const { invalidateDetail } =
    useInvalidateEventDetailsToGuestInscriptionQuery();

  const schema = React.useMemo(
    () => buildGuestInscriptionSchema(participantFieldsConfig),
    [participantFieldsConfig],
  );

  const form = useForm<GuestInscriptionSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cpf: '',
      gender: 'MASCULINO',
      localityId: undefined,
      birthDate: '',
      typeInscriptionId: '',
      preferredName: undefined,
      shirtSize: undefined,
      shirtType: undefined,
    },
  });

  async function onRegisterGuestSubmit(input: GuestInscriptionSchemaType) {
    setIsLoading(true);
    setLoading(true);
    try {
      const result = await registerGuestInscriptionAction(eventId, input);
      invalidateDetail(eventId);
      form.reset();
      return {
        id: result.id,
        status: result.status,
        confirmationCode: result.confirmationCode,
        expiresAt: result.expiresAt,
      };
    } catch (error) {
      const err = error as Error;
      toast.error('Erro ao tentar atualizar o evento', {
        description: err.message,
        richColors: true,
      });
      throw err;
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }

  const onSubmit = async (event?: React.BaseSyntheticEvent) => {
    let result: UseFormRegisterGuestInscriptionType extends {
      onSubmit: infer T;
    }
      ? T extends (...args: any) => Promise<infer R>
        ? R
        : never
      : never;
    await form.handleSubmit(async (values) => {
      result = (await onRegisterGuestSubmit(values)) as any;
    })(event);
    return result;
  };

  return { form, onSubmit, isLoading };
}
