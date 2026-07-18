'use client';

import { useGlobalLoading } from '@/components/GlobalLoading';
import { useInvalidateListPaymentPendingQuery } from '@/features/payments/hooks/registerPayment/UseListPaymentPendingQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { registerPaymentPixAction } from '../../actions/registerPayment/registerPaymentPixAction';
import {
  registerPaymentPixSchema,
  RegisterPaymentPixSchemaType,
} from '../../schema/registerPayment/registerPaymentSchema';

export type UseRegisterPaymentPixType = {
  form: ReturnType<typeof useForm<RegisterPaymentPixSchemaType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
};

export function useRegisterPaymentPix(
  inscriptionIds: string[],
  name: string,
  value: number,
  eventId: string,
  file: File | null,
  email?: string,
): UseRegisterPaymentPixType {
  const router = useRouter();
  const { setLoading } = useGlobalLoading();
  const [isLoading, setIsLoading] = useState(false);
  const { invalidateAll } = useInvalidateListPaymentPendingQuery();
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
      await registerPaymentPixAction(eventId, {
        inscriptionIds,
        file,
        ...input,
      });
      invalidateAll();
      form.reset();

      const params = new URLSearchParams({
        eventId,
        clientName: input.name,
      });

      router.replace(`/user/payment/success?${params.toString()}`);
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
