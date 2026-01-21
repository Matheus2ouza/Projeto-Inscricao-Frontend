"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateEventPayment } from "../api/manager/eventActions/updateEventPayment";

export function useEventPayment() {
  const [loading, setLoading] = useState(false);

  const updatePayment = async (eventId: string, paymentEnabled: boolean) => {
    setLoading(true);
    try {
      const result = await updateEventPayment({
        eventId,
        paymentEnabled,
      });

      if (result.id) {
        if (result.paymentStatus) {
          toast.success("Os Pagamentos das inscrições foi aberto com sucesso");
          return true;
        }
        toast.success("Os Pagamentos das inscrições foi fechado com sucesso");
        return true;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado";
      toast.error("Erro ao atualizar status de pagamento", {
        description: errorMessage,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updatePayment,
  };
}
