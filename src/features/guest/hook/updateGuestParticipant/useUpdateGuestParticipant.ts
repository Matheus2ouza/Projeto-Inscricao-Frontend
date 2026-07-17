'use client';

import { useGlobalLoading } from '@/components/GlobalLoading';
import {
  buildGuestParticipantSchema,
  GuestParticipantSchemaType,
} from '@/features/guest/schema/updateGuestParticipant/updateGuestParticipantSchema';
import {
  GenderType,
  Participant,
  ParticipantFieldsConfig,
} from '@/features/guest/types/detailsInscription/detailsInscriptionType';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateGuestParticipantAction } from '../../actions/updateGuestParticipants/updateGuestParticipants';
import { useInvalidateDetailsGuestInscriptionQuery } from '../detailsInscription/useDetailsInscriptionQuery';

export type UseFormUpdateGuestParticipantType = {
  form: ReturnType<typeof useForm<GuestParticipantSchemaType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
};

export function useFormUpdateGuestParticipant(
  participant: Participant,
  participantFieldsConfig: ParticipantFieldsConfig,
): UseFormUpdateGuestParticipantType {
  const { setLoading } = useGlobalLoading();
  const [isLoading, setIsLoading] = React.useState(false);
  const { invalidateDetails } = useInvalidateDetailsGuestInscriptionQuery();

  const schema = React.useMemo(
    () => buildGuestParticipantSchema(participantFieldsConfig),
    [participantFieldsConfig],
  );

  const form = useForm<GuestParticipantSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: participant?.name || '',
      cpf: participant?.cpf || '',
      gender: participant?.gender || GenderType.MASCULINO,
      birthDate: participant?.birthDate || '',
      preferredName: participant?.preferredName || undefined,
      shirtSize: participant?.shirtSize || undefined,
      shirtType: participant?.shirtType || undefined,
    },
  });

  async function onUpdateParticipantSubmit(input: GuestParticipantSchemaType) {
    setIsLoading(true);
    setLoading(true);
    try {
      await updateGuestParticipantAction(participant.id, input);
      toast.success('Participante atualizado com sucesso');
      invalidateDetails();
      form.reset(input);
    } catch (error) {
      const err = error as Error;
      toast.error('Erro ao tentar atualizar o participante', {
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
    await form.handleSubmit(onUpdateParticipantSubmit)(event);
  };

  return { form, onSubmit, isLoading };
}
