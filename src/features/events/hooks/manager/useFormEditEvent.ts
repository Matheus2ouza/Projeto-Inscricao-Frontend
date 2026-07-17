'use client';

import {
  Event,
  InscriptionMode,
} from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';
import { useCurrentUser } from '@/shared/context/user-context';
import { useState } from 'react';
import { toast } from 'sonner';
import { useInvalidateEventsQuery } from '../../../expenses/hooks/useSelectEventsQuery';
import { useInvalidateEventDetailsManagerQuery } from './eventDetailsManager/useEventDetailsManagerQuery';
import { useEventManagerMutations } from './useEventManagerMutations';

export function useFormEditEvent(event: Event) {
  const { user } = useCurrentUser();
  const { invalidateList: invalidateExpensesList } = useInvalidateEventsQuery();
  const { invalidateDetail, invalidateLists: invalidateManagerList } =
    useInvalidateEventDetailsManagerQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mutations (apenas as que não são de update do evento)
  const {
    handleDeleteEvent,
    isDeletingEvent,
    handleUpdateAllowCard,
    isUpdatingAllowCard,
    handleUpdateEventPayment,
    isUpdatingEventPayment,
    handleUpdateEventInscriptions,
    isUpdatingEventInscriptions,
  } = useEventManagerMutations(event.id);

  const roleSegment = user?.role?.toLowerCase() === 'super' ? 'super' : 'admin';

  // IDs dos responsáveis originais do evento
  const originalResponsibleIds = event.responsibles?.map((r) => r.id) || [];

  // Modos de inscrição originais do evento
  const originalInscriptionModes = event.allowedInscriptionModes || [];

  const [formData, setFormData] = useState({
    status: event.status || 'CLOSE',
    responsibleIds: originalResponsibleIds,
    allowedInscriptionModes: originalInscriptionModes,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleDelete = async (): Promise<boolean> => {
    try {
      setLoading(true);
      await handleDeleteEvent();

      toast.success('Evento excluído com sucesso!');

      // Redirecionar para a lista de eventos
      window.location.href = `/${roleSegment}/events/manager`;
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAllowCardFn = async (allowCard: boolean) => {
    try {
      await handleUpdateAllowCard(allowCard);
      // Invalidar cache do evento
      invalidateDetail(event.id);
      invalidateManagerList();
      invalidateExpensesList();
    } catch (error) {
      console.error('Error updating allow card:', error);
    }
  };

  const handleUpdatePayment = async (paymentEnabled: boolean) => {
    try {
      await handleUpdateEventPayment({
        eventId: event.id,
        paymentEnabled,
      });
      // Invalidar cache do evento
      invalidateDetail(event.id);
      invalidateManagerList();
      invalidateExpensesList();
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleUpdateInscription = async (status: 'OPEN' | 'CLOSE') => {
    try {
      await handleUpdateEventInscriptions({
        eventId: event.id,
        status,
      });
      // Invalidar cache do evento
      invalidateDetail(event.id);
      invalidateManagerList();
      invalidateExpensesList();
    } catch (error) {
      console.error('Error updating inscriptions:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      status: event.status || 'CLOSE',
      responsibleIds: originalResponsibleIds,
      allowedInscriptionModes: originalInscriptionModes,
    });
    setIsEditing(false);
  };

  // Função para obter apenas os IDs dos novos responsáveis adicionados
  const getNewResponsibleIds = (): string[] => {
    return formData.responsibleIds.filter(
      (id) => !originalResponsibleIds.includes(id),
    );
  };

  // Função para obter apenas os novos modos de inscrição adicionados
  const getNewInscriptionModes = (): InscriptionMode[] => {
    return formData.allowedInscriptionModes.filter(
      (mode) => !originalInscriptionModes.includes(mode),
    );
  };

  const handleResponsiblesChange = (responsibleIds: string[]) => {
    setFormData((prev) => ({
      ...prev,
      responsibleIds,
    }));
  };

  const handleInscriptionModesChange = (modes: InscriptionMode[]) => {
    setFormData((prev) => ({
      ...prev,
      allowedInscriptionModes: modes,
    }));
  };

  return {
    isEditing,
    setIsEditing,
    loading:
      loading ||
      isDeletingEvent ||
      isUpdatingAllowCard ||
      isUpdatingEventPayment ||
      isUpdatingEventInscriptions,
    formData,
    originalResponsibleIds,
    originalInscriptionModes,
    handleInputChange,
    handleDelete,
    handleCancel,
    handleUpdatePayment,
    handleUpdateAllowCard: handleUpdateAllowCardFn,
    handleUpdateInscription,
    handleResponsiblesChange,
    handleInscriptionModesChange,
    getNewResponsibleIds,
    getNewInscriptionModes,
  };
}
