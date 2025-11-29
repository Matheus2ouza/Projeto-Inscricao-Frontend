"use client";

import { downloadSecondCopyPdf } from "@/features/tickets/api/downloadSecondCopyPdf";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const DEFAULT_ERROR_MESSAGE =
  "Não foi possível gerar a segunda via deste ticket.";

function downloadPdf(pdfBase64: string, filename: string) {
  const byteCharacters = atob(pdfBase64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function useTicketSalesListActions() {
  const [downloadingSaleId, setDownloadingSaleId] = useState<string | null>(
    null
  );

  const handleDownloadSecondCopy = useCallback(async (ticketSaleId: string) => {
    if (!ticketSaleId) {
      toast.error("Venda inválida para gerar segunda via.");
      return;
    }

    try {
      setDownloadingSaleId(ticketSaleId);
      const { pdfBase64, filename } = await downloadSecondCopyPdf(ticketSaleId);
      downloadPdf(pdfBase64, filename);
      toast.success("Segunda via gerada com sucesso.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
      toast.error(message || DEFAULT_ERROR_MESSAGE);
    } finally {
      setDownloadingSaleId(null);
    }
  }, []);

  return {
    handleDownloadSecondCopy,
    downloadingSaleId,
  };
}
