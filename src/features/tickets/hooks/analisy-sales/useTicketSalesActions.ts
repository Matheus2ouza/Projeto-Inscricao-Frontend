import { approvePreSale } from "@/features/tickets/api/analisy-sales/actions/approvePreSale";
import { rejectPreSale } from "@/features/tickets/api/analisy-sales/actions/rejectPreSale";
import type { TicketSaleAnalysis } from "@/features/tickets/types/analisy-sales/ticketSalesAnalysisTypes";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

type UseTicketSalesActionsParams = {
  onSuccess?: () => void;
};

export function useTicketSalesActions({ onSuccess }: UseTicketSalesActionsParams = {}) {
  const [approvingSaleId, setApprovingSaleId] = useState<string | null>(null);
  const [cancellingSaleId, setCancellingSaleId] = useState<string | null>(null);

  const approveMutation = useMutation({
    mutationFn: approvePreSale,
    onSuccess: () => {
      toast.success("Pré-venda aprovada com sucesso!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao aprovar a pré-venda.");
    },
    onSettled: () => setApprovingSaleId(null),
  });

  const cancelMutation = useMutation({
    mutationFn: rejectPreSale,
    onSuccess: () => {
      toast.success("Pré-venda cancelada.");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao cancelar a pré-venda.");
    },
    onSettled: () => setCancellingSaleId(null),
  });

  const handleApproveSale = (sale: TicketSaleAnalysis) => {
    if (!sale?.id) return;
    setApprovingSaleId(sale.id);
    approveMutation.mutate({
      ticketSalesId: sale.id,
    });
  };

  const handleCancelSale = (sale: TicketSaleAnalysis) => {
    if (!sale?.id) return;
    setCancellingSaleId(sale.id);
    cancelMutation.mutate({
      ticketSalesId: sale.id,
    });
  };

  return {
    approvingSaleId,
    cancellingSaleId,
    handleApproveSale,
    handleCancelSale,
    isApproving: approveMutation.isPending,
    isCancelling: cancelMutation.isPending,
  };
}
