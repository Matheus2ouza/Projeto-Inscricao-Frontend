import { useGlobalLoading } from '@/components/GlobalLoading';
import { InscriptionDetails } from '@/features/guest/types/detailsInscription/detailsInscriptionType';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateGuestInscriptionAction } from '../../actions/updateGuestInscription/updateGuestInscription';
import {
  UpdateGuestInscriptionSchemaType,
  updateGuestInscriptionSchema,
} from '../../schema/updateGuestInscription/updateGuestInscription';
import { useInvalidateDetailsGuestInscriptionQuery } from '../detailsInscription/useDetailsInscriptionQuery';

export type UseFormUpdateGuestInscriptionType = {
  form: ReturnType<typeof useForm<UpdateGuestInscriptionSchemaType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
};

export function useFormUpdateGuestInscription(
  guestInscription: InscriptionDetails,
): UseFormUpdateGuestInscriptionType {
  const { setLoading } = useGlobalLoading();
  const [isLoading, setIsLoading] = useState(false);
  const { invalidateDetails } = useInvalidateDetailsGuestInscriptionQuery();

  const form = useForm<UpdateGuestInscriptionSchemaType>({
    resolver: zodResolver(updateGuestInscriptionSchema),
    defaultValues: {
      locality: guestInscription.localityId,
      guestName: guestInscription.guestName,
      guestEmail: guestInscription.guestEmail,
      phone: guestInscription.phone,
    },
  });

  async function onUpdateSubmit(input: UpdateGuestInscriptionSchemaType) {
    (setIsLoading(true), setLoading(true));
    try {
      await updateGuestInscriptionAction({
        id: guestInscription.id,
        ...input,
      });
      invalidateDetails();
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

  const onSubmit = async (event?: React.BaseSyntheticEvent) =>
    form.handleSubmit(onUpdateSubmit)(event);

  const output: UseFormUpdateGuestInscriptionType = {
    form,
    onSubmit,
    isLoading,
  };

  return output;
}
