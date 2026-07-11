'use client';

import {
  Event,
  InscriptionMode,
  UpdateEventInput,
} from '@/features/events/types/manager/eventManagerTypes';
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

  // Mutations
  const {
    handleUpdateEvent,
    isUpdatingEvent,
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
    name: event.name,
    description: event.description || '',
    startDate: event.startDate.split('T')[0],
    endDate: event.endDate.split('T')[0],
    startTime: event.startDate.includes('T')
      ? event.startDate.split('T')[1].substring(0, 5)
      : '00:00',
    endTime: event.endDate.includes('T')
      ? event.endDate.split('T')[1].substring(0, 5)
      : '00:00',
    location: event.location || '',
    latitude: event.latitude || 0,
    longitude: event.longitude || 0,
    maxParticipants: event.maxParticipants || 0,
    ticketPrice: event.ticketPrice || 0,
    status: event.status || 'CLOSE',
    active: event.active || false,
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

  const handleSave = async (newResponsibleIds?: string[]) => {
    try {
      setLoading(true);

      // Combinar data e hora
      const startDate = `${formData.startDate}T${formData.startTime}:00`;
      const endDate = `${formData.endDate}T${formData.endTime}:00`;

      const updateData: UpdateEventInput = {
        name: formData.name,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        location: formData.location,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        maxParticipants: formData.maxParticipants || undefined,
        ticketPrice: formData.ticketPrice || undefined,
        status: formData.status,
        active: formData.active,
        responsibles:
          newResponsibleIds && newResponsibleIds.length > 0
            ? newResponsibleIds
            : undefined,
        allowedInscriptionModes: formData.allowedInscriptionModes,
      };

      await handleUpdateEvent(updateData);

      // Invalidar cache do evento e da lista de eventos
      invalidateDetail(event.id);
      invalidateManagerList();
      invalidateExpensesList();

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setLoading(false);
    }
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
      name: event.name,
      description: event.description || '',
      startDate: event.startDate.split('T')[0],
      endDate: event.endDate.split('T')[0],
      startTime: event.startDate.includes('T')
        ? event.startDate.split('T')[1].substring(0, 5)
        : '00:00',
      endTime: event.endDate.includes('T')
        ? event.endDate.split('T')[1].substring(0, 5)
        : '00:00',
      location: event.location || '',
      latitude: event.latitude || 0,
      longitude: event.longitude || 0,
      maxParticipants: event.maxParticipants || 0,
      ticketPrice: event.ticketPrice || 0,
      status: event.status || 'CLOSE',
      active: event.active || false,
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
      isUpdatingEvent ||
      isDeletingEvent ||
      isUpdatingAllowCard ||
      isUpdatingEventPayment ||
      isUpdatingEventInscriptions,
    formData,
    originalResponsibleIds,
    originalInscriptionModes,
    handleInputChange,
    handleSave,
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
