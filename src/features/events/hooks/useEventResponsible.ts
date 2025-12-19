import { useGlobalLoading } from "@/components/GlobalLoading";
import { useState } from "react";
import { toast } from "sonner";
import { useInvalidateEventsQuery } from "../../gastos/hooks/useSelectEventsQuery";
import { deleteEventResponsible } from "../api/eventActions/deleteEventResponsible";

export function useEventResponsible() {
  const { invalidateDetail } = useInvalidateEventsQuery();
  const { setLoading: setGlobalLoading } = useGlobalLoading();
  const [loading, setLoading] = useState(false);

  const remove = async (
    eventId: string,
    accountId: string,
    onSuccess?: () => void
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setGlobalLoading(true);
      await deleteEventResponsible(eventId, accountId);
      toast.success("Responsável removido com sucesso!");

      // Invalidar cache do evento
      invalidateDetail(eventId);

      // Callback de sucesso
      if (onSuccess) {
        onSuccess();
      }

      return true;
    } catch (error) {
      toast.error("Erro ao remover responsável");
      console.error("Error removing responsible:", error);
      return false;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  return {
    loading,
    remove,
  };
}

