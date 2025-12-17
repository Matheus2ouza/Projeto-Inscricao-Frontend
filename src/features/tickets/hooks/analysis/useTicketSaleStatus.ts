"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { updateStatusTicket } from "../../api/analysis/updateStatusTicket";
import { TicketsByEventResponse, ticketsKeys } from "../../types/analysis/ticketsTypes";

export function useTicketSaleStatus() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateTicketSaleStatus = async (
    eventId: string,
    saleTicketsEnabled: boolean
  ) => {
    setLoading(true);
    try {
      await updateStatusTicket(eventId, saleTicketsEnabled);
      queryClient.setQueryData(
        ticketsKeys.byEvent(eventId),
        (previous: TicketsByEventResponse | undefined) =>
          previous
            ? {
              ...previous,
              ticketEnabled: saleTicketsEnabled,
            }
            : previous
      );
      toast.success(
        saleTicketsEnabled
          ? "Venda de tickets aberta com sucesso!"
          : "Venda de tickets encerrada com sucesso!"
      );
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar os tickets.";
      toast.error("Erro ao atualizar status dos tickets", {
        description: message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateTicketSaleStatus,
  };
}
