"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateEventInscriptions } from "../api/manager/eventActions/updateEventInscriptions";

export function useEventInscriptions() {
  const [loading, setLoading] = useState(false);

  const updateInscriptions = async (
    eventId: string,
    status: "OPEN" | "CLOSE",
  ) => {
    setLoading(true);
    try {
      const result = await updateEventInscriptions({
        eventId,
        status,
      });

      if (result.id) {
        if (result.InscriptionStatus === "OPEN") {
          toast.success("Inscrições Abertas com sucesso");
          return true;
        }

        toast.success("Inscrições Fechadas com sucesso");
        return true;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado";
      toast.error("Erro ao atualizar status das inscrições", {
        description: errorMessage,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateInscriptions,
  };
}
