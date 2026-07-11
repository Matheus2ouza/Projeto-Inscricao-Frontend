'use client';

import { deleteEventAction } from '@/features/events/actions/manager/deleteEvent/deleteEventAction';
import { deleteEventResponsibleAction } from '@/features/events/actions/manager/deleteEventResponsible/deleteEventResponsibleAction';
import { deleteImageEventAction } from '@/features/events/actions/manager/deleteImageEvent/deleteImageEventAction';
import { deleteLogoEventAction } from '@/features/events/actions/manager/deleteLogoEvent/deleteLogoEventAction';
import { updateAllowCardAction } from '@/features/events/actions/manager/updateAllowCard/updateAllowCardAction';
import { updateEventAction } from '@/features/events/actions/manager/updateEvent/updateEventAction';
import { updateEventImageAction } from '@/features/events/actions/manager/updateEventImage/updateEventImageAction';
import { updateEventInscriptionsAction } from '@/features/events/actions/manager/updateEventInscriptions/updateEventInscriptionsAction';
import { updateEventLocationAction } from '@/features/events/actions/manager/updateEventLocation/updateEventLocationAction';
import { updateEventLogoAction } from '@/features/events/actions/manager/updateEventLogo/updateEventLogoAction';
import { updateEventPaymentAction } from '@/features/events/actions/manager/updateEventPayment/updateEventPaymentAction';
import type { UpdateEventInput } from '@/features/events/types/manager/updateEvent/updateEventTypes';
import type { UpdateEventImageInput } from '@/features/events/types/manager/updateEventImage/updateEventImageTypes';
import type { UpdateEventInscriptionsInput } from '@/features/events/types/manager/updateEventInscriptions/updateEventInscriptionsTypes';
import type { UpdateEventLocationInput } from '@/features/events/types/manager/updateEventLocation/updateEventLocationTypes';
import type { UpdateEventLogoInput } from '@/features/events/types/manager/updateEventLogo/updateEventLogoTypes';
import type { UpdateEventPaymentInput } from '@/features/events/types/manager/updateEventPayment/updateEventPaymentTypes';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useInvalidateEventDetailsManagerQuery } from './eventDetailsManager/useEventDetailsManagerQuery';

export function useEventManagerMutations(eventId: string) {
  const { invalidateDetail, invalidateDetails } =
    useInvalidateEventDetailsManagerQuery();

  // Update Event
  const { mutateAsync: updateEventMutation, isPending: isUpdatingEvent } =
    useMutation({
      mutationFn: (input: UpdateEventInput) =>
        updateEventAction(eventId, input),
      onSuccess: () => {
        invalidateDetail(eventId);
        invalidateDetails();
        toast.success('Evento atualizado com sucesso!');
      },
      onError: (error: Error) => {
        toast.error('Erro ao atualizar evento', {
          description: error.message,
        });
      },
    });

  // Delete Event
  const { mutateAsync: deleteEventMutation, isPending: isDeletingEvent } =
    useMutation({
      mutationFn: () => deleteEventAction(eventId),
      onSuccess: () => {
        toast.success('Evento excluído com sucesso!');
        invalidateDetails();
      },
      onError: (error: Error) => {
        toast.error('Erro ao excluir evento', {
          description: error.message,
        });
      },
    });

  // Delete Event Responsible
  const {
    mutateAsync: deleteEventResponsibleMutation,
    isPending: isDeletingEventResponsible,
  } = useMutation({
    mutationFn: (accountId: string) =>
      deleteEventResponsibleAction(eventId, accountId),
    onSuccess: () => {
      invalidateDetail(eventId);
      invalidateDetails();
      toast.success('Responsável removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao remover responsável', {
        description: error.message,
      });
    },
  });

  // Delete Image Event
  const {
    mutateAsync: deleteImageEventMutation,
    isPending: isDeletingImageEvent,
  } = useMutation({
    mutationFn: () => deleteImageEventAction(eventId),
    onSuccess: () => {
      invalidateDetail(eventId);
      invalidateDetails();
      toast.success('Imagem do evento deletada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao deletar imagem do evento', {
        description: error.message,
      });
    },
  });

  // Delete Logo Event
  const {
    mutateAsync: deleteLogoEventMutation,
    isPending: isDeletingLogoEvent,
  } = useMutation({
    mutationFn: () => deleteLogoEventAction(eventId),
    onSuccess: () => {
      invalidateDetail(eventId);
      invalidateDetails();
      toast.success('Logo do evento deletado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao deletar logo do evento', {
        description: error.message,
      });
    },
  });

  // Update Allow Card
  const {
    mutateAsync: updateAllowCardMutation,
    isPending: isUpdatingAllowCard,
  } = useMutation({
    mutationFn: (allowCard: boolean) =>
      updateAllowCardAction(eventId, allowCard),
    onSuccess: () => {
      invalidateDetail(eventId);
      invalidateDetails();
      toast.success('Configuração de pagamento atualizada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar configuração de pagamento', {
        description: error.message,
      });
    },
  });

  // Update Event Payment
  const {
    mutateAsync: updateEventPaymentMutation,
    isPending: isUpdatingEventPayment,
  } = useMutation({
    mutationFn: (input: UpdateEventPaymentInput) =>
      updateEventPaymentAction(input),
    onSuccess: () => {
      invalidateDetail(eventId);
      invalidateDetails();
      toast.success('Status de pagamento atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar status de pagamento', {
        description: error.message,
      });
    },
  });

  // Update Event Inscriptions
  const {
    mutateAsync: updateEventInscriptionsMutation,
    isPending: isUpdatingEventInscriptions,
  } = useMutation({
    mutationFn: (input: UpdateEventInscriptionsInput) =>
      updateEventInscriptionsAction(input),
    onSuccess: () => {
      invalidateDetail(eventId);
      invalidateDetails();
      toast.success('Status das inscrições atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar status das inscrições', {
        description: error.message,
      });
    },
  });

  // Update Event Location
  const {
    mutateAsync: updateEventLocationMutation,
    isPending: isUpdatingEventLocation,
  } = useMutation({
    mutationFn: (input: UpdateEventLocationInput) =>
      updateEventLocationAction(input),
    onSuccess: () => {
      invalidateDetail(eventId);
      invalidateDetails();
      toast.success('Localização do evento atualizada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar localização do evento', {
        description: error.message,
      });
    },
  });

  // Update Event Image
  const {
    mutateAsync: updateEventImageMutation,
    isPending: isUpdatingEventImage,
  } = useMutation({
    mutationFn: (input: UpdateEventImageInput) => updateEventImageAction(input),
    onSuccess: () => {
      invalidateDetail(eventId);
      invalidateDetails();
      toast.success('Imagem do evento atualizada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar imagem do evento', {
        description: error.message,
      });
    },
  });

  // Update Event Logo
  const {
    mutateAsync: updateEventLogoMutation,
    isPending: isUpdatingEventLogo,
  } = useMutation({
    mutationFn: (input: UpdateEventLogoInput) => updateEventLogoAction(input),
    onSuccess: () => {
      invalidateDetail(eventId);
      invalidateDetails();
      toast.success('Logo do evento atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar logo do evento', {
        description: error.message,
      });
    },
  });

  return {
    // Update
    handleUpdateEvent: updateEventMutation,
    isUpdatingEvent,

    // Delete
    handleDeleteEvent: deleteEventMutation,
    isDeletingEvent,

    // Delete Responsible
    handleDeleteEventResponsible: deleteEventResponsibleMutation,
    isDeletingEventResponsible,

    // Delete Image
    handleDeleteImageEvent: deleteImageEventMutation,
    isDeletingImageEvent,

    // Delete Logo
    handleDeleteLogoEvent: deleteLogoEventMutation,
    isDeletingLogoEvent,

    // Update Allow Card
    handleUpdateAllowCard: updateAllowCardMutation,
    isUpdatingAllowCard,

    // Update Payment
    handleUpdateEventPayment: updateEventPaymentMutation,
    isUpdatingEventPayment,

    // Update Inscriptions
    handleUpdateEventInscriptions: updateEventInscriptionsMutation,
    isUpdatingEventInscriptions,

    // Update Location
    handleUpdateEventLocation: updateEventLocationMutation,
    isUpdatingEventLocation,

    // Update Image
    handleUpdateEventImage: updateEventImageMutation,
    isUpdatingEventImage,

    // Update Logo
    handleUpdateEventLogo: updateEventLogoMutation,
    isUpdatingEventLogo,
  };
}
