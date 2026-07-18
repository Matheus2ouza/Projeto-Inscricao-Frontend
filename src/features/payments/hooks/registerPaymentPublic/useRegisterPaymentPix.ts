'use client';

import { useGlobalLoading } from '@/components/GlobalLoading';
import { useInvalidateDetailsGuestInscriptionQuery } from '@/features/guest/hook/detailsInscription/useDetailsInscriptionQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { registerPaymentPixAction } from '../../actions/registerPaymentPublic/registerPaymentPixAction';
import {
  registerPaymentPixSchema,
  RegisterPaymentPixSchemaType,
} from '../../schema/registerPaymentPublic/registerPaymentSchema';

export type UseRegisterPaymentPixType = {
  form: ReturnType<typeof useForm<RegisterPaymentPixSchemaType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
};

export function useRegisterPaymentPix(
  inscriptionId: string,
  name: string,
  email: string,
  value: number,
  eventId: string,
  file: File | null,
): UseRegisterPaymentPixType {
  const router = useRouter();
  const { setLoading } = useGlobalLoading();
  const [isLoading, setIsLoading] = useState(false);
  const { invalidateDetails } = useInvalidateDetailsGuestInscriptionQuery();
  const now = new Date();
  const defaultDate = format(now, "yyyy-MM-dd'T'HH:mm:ss");

  const form = useForm<RegisterPaymentPixSchemaType>({
    resolver: zodResolver(registerPaymentPixSchema(value)),
    defaultValues: {
      name: name || '',
      email: email || '',
      value: undefined,
      date: defaultDate,
    },
  });

  async function onRegisterPaymentPix(input: RegisterPaymentPixSchemaType) {
    if (!file) {
      toast.error('Selecione o comprovante antes de enviar', {
        richColors: true,
      });
      return;
    }
    setIsLoading(true);
    setLoading(true);

    try {
      const response = await registerPaymentPixAction({
        inscriptionId,
        file,
        ...input,
      });
      invalidateDetails();
      form.reset();

      const params = new URLSearchParams({
        eventId,
        clientName: input.name,
        confirmationCode: response.confirmationCode,
      });

      router.replace(`/guest/${eventId}/payment/success?${params.toString()}`);
    } catch (error) {
      const err = error as Error;
      toast.error('Erro ao tentar registrar o pagamento', {
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
    await form.handleSubmit(onRegisterPaymentPix)(event);
  };

  return { form, onSubmit, isLoading };
}
