"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateStatusTicket } from "../api/updateStatusTicket";
import { ticketsKeys, TicketsByEventResponse } from "../types/ticketsTypes";

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
