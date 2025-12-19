"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { useState } from "react";
import { toast } from "sonner";
import { useInvalidateEventsQuery } from "../../gastos/hooks/useSelectEventsQuery";
import { updateEventLocation } from "../api/eventActions/updateEventLocation";

export function useEventLocation() {
  const [loading, setLoading] = useState(false);
  const { setLoading: setGlobalLoading } = useGlobalLoading();
  const { invalidateDetail } = useInvalidateEventsQuery();

  const updateLocation = async (
    eventId: string,
    location: string,
    longitude: number,
    latitude: number
  ) => {
    setLoading(true);
    setGlobalLoading(true);
    try {
      await updateEventLocation({
        eventId,
        location,
        longitude,
        latitude,
      });

      // Invalidar cache do evento
      invalidateDetail(eventId);

      toast.success("Localização atualizada com sucesso");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado";
      toast.error("Erro ao atualizar localização do evento", {
        description: errorMessage,
      });
      return false;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  return {
    loading,
    updateLocation,
  };
}

