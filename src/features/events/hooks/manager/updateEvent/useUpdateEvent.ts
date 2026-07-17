import { updateEventAction } from '@/features/events/actions/manager/updateEvent/updateEventAction';
import {
  UpdateEventFormType,
  updateEventSchema,
} from '@/features/events/schema/manager/updateEventSchema';
import { Event } from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useInvalidateEventDetailsManagerQuery } from '../eventDetailsManager/useEventDetailsManagerQuery';

type UpdateEventType = {
  form: ReturnType<typeof useForm<UpdateEventFormType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
};

export function useUpdateEvent(event: Event): UpdateEventType {
  const { invalidateDetail } = useInvalidateEventDetailsManagerQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<UpdateEventFormType>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      name: event.name,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      location: event.location,
      longitude: event.longitude,
      latitude: event.latitude,
    },
  });

  async function onUpdateEventSubmit(input: UpdateEventFormType) {
    setIsLoading(true);
    setIsSuccess(false);
    try {
      const result = await updateEventAction(event.id, input);

      toast.success('Dados do evento atualizados');
      invalidateDetail(event.id);
      setIsSuccess(true);

      return result;
    } catch (error) {
      const err = error as Error;
      toast.error('Erro ao tentar atualizar o evento', {
        description: err.message,
        richColors: true,
      });
      setIsSuccess(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit = async (event?: React.BaseSyntheticEvent) => {
    return new Promise<void>((resolve, reject) => {
      form.handleSubmit(async (data) => {
        try {
          await onUpdateEventSubmit(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      })(event);
    });
  };

  return {
    form,
    onSubmit,
    isLoading,
    isSuccess,
  };
}
