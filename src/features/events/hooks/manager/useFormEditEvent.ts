import {
  Event,
  UpdateEventInput,
} from "@/features/events/types/manager/eventManagerTypes";
import { useCurrentUser } from "@/shared/context/user-context";
import { useState } from "react";
import { toast } from "sonner";
import { useInvalidateEventsQuery } from "../../../expenses/hooks/useSelectEventsQuery";
import { deleteEvent } from "../../api/manager/eventActions/deleteEvent";
import { updateAllowCard } from "../../api/manager/eventActions/updateAllowCard";
import { updateEvent } from "../../api/manager/eventActions/updateEvent";
import { useEventInscriptions } from "../useEventInscriptions";
import { useEventPayment } from "../useEventPayment";

export function useFormEditEvent(event: Event) {
  const { user } = useCurrentUser();
  const { invalidateDetail, invalidateList } = useInvalidateEventsQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loading: paymentLoading, updatePayment } = useEventPayment();
  const { loading: inscriptionsLoading, updateInscriptions } =
    useEventInscriptions();

  const roleSegment = user?.role?.toLowerCase() === "super" ? "super" : "admin";

  // IDs dos responsáveis originais do evento
  const originalResponsibleIds = event.responsibles?.map((r) => r.id) || [];

  const [formData, setFormData] = useState({
    name: event.name,
    description: event.description || "",
    startDate: event.startDate.split("T")[0],
    endDate: event.endDate.split("T")[0],
    startTime: event.startDate.includes("T")
      ? event.startDate.split("T")[1].substring(0, 5)
      : "00:00",
    endTime: event.endDate.includes("T")
      ? event.endDate.split("T")[1].substring(0, 5)
      : "00:00",
    location: event.location || "",
    latitude: event.latitude || 0,
    longitude: event.longitude || 0,
    maxParticipants: event.maxParticipants || 0,
    ticketPrice: event.ticketPrice || 0,
    status: event.status || "CLOSE",
    active: event.active || false,
    responsibleIds: originalResponsibleIds,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
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
      };

      await updateEvent(event.id, updateData);

      // Invalidar cache do evento e da lista de eventos
      invalidateDetail(event.id);
      invalidateList();

      toast.success("Evento atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Erro ao atualizar evento");
      console.error("Error updating event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (): Promise<boolean> => {
    try {
      setLoading(true);
      await deleteEvent(event.id);
      toast.success("Evento excluído com sucesso!");

      // Redirecionar para a lista de eventos
      window.location.href = `/${roleSegment}/events/manager`;
      return true;
    } catch (error) {
      toast.error("Erro ao excluir evento");
      console.error("Error deleting event:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAllowCard = async (allowCard: boolean) => {
    const success = await updateAllowCard(event.id, allowCard);
    if (success) {
      toast.success("Configuração de pagamento atualizada com sucesso!");
      // Invalidar cache do evento
      invalidateDetail(event.id);
      invalidateList();
    }
  };

  const handleUpdatePayment = async (paymentEnabled: boolean) => {
    const success = await updatePayment(event.id, paymentEnabled);
    if (success) {
      // Invalidar cache do evento
      invalidateDetail(event.id);
      invalidateList();
    }
  };

  const handleUpdateInscription = async (status: "OPEN" | "CLOSE") => {
    const success = await updateInscriptions(event.id, status);
    if (success) {
      // Invalidar cache do evento
      invalidateDetail(event.id);
      invalidateList();
    }
  };

  const handleCancel = () => {
    setFormData({
      name: event.name,
      description: event.description || "",
      startDate: event.startDate.split("T")[0],
      endDate: event.endDate.split("T")[0],
      startTime: event.startDate.includes("T")
        ? event.startDate.split("T")[1].substring(0, 5)
        : "00:00",
      endTime: event.endDate.includes("T")
        ? event.endDate.split("T")[1].substring(0, 5)
        : "00:00",
      location: event.location || "",
      latitude: event.latitude || 0,
      longitude: event.longitude || 0,
      maxParticipants: event.maxParticipants || 0,
      ticketPrice: event.ticketPrice || 0,
      status: event.status || "CLOSE",
      active: event.active || false,
      responsibleIds: originalResponsibleIds,
    });
    setIsEditing(false);
  };

  // Função para obter apenas os IDs dos novos responsáveis adicionados
  const getNewResponsibleIds = (): string[] => {
    return formData.responsibleIds.filter(
      (id) => !originalResponsibleIds.includes(id),
    );
  };

  const handleResponsiblesChange = (responsibleIds: string[]) => {
    setFormData((prev) => ({
      ...prev,
      responsibleIds,
    }));
  };

  return {
    isEditing,
    setIsEditing,
    loading: loading || paymentLoading || inscriptionsLoading,
    formData,
    originalResponsibleIds,
    handleInputChange,
    handleSave,
    handleDelete,
    handleCancel,
    handleUpdatePayment,
    handleUpdateAllowCard,
    handleUpdateInscription,
    handleResponsiblesChange,
    getNewResponsibleIds,
  };
}
