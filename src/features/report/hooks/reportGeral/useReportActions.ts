"use client";

import { genaratePdfReport } from "@/features/report/api/reportGeral/genaratePdfReport";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { genaratePdfFinancialReport } from "../../api/reportFinancial/genaratePdfFinancial";

interface UseReportActionsProps {
  eventId: string;
}

export function useReportActions({ eventId }: UseReportActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadReport = useCallback(async () => {
    if (!eventId) return;
    setIsDownloading(true);
    try {
      const { pdfBase64, filename } = await genaratePdfReport({ eventId });
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível baixar o relatório.";
      toast.error("Erro ao baixar relatório", { description: message });
    } finally {
      setIsDownloading(false);
    }
  }, [eventId]);

  const downloadFinancialReport = useCallback(
    async (details: boolean) => {
      if (!eventId) return;
      setIsDownloading(true);
      try {
        const { pdfBase64, filename } = await genaratePdfFinancialReport({
          eventId,
          details,
        });
        const byteCharacters = atob(pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Não foi possível baixar o relatório.";
        toast.error("Erro ao baixar relatório", { description: message });
      } finally {
        setIsDownloading(false);
      }
    },
    [eventId],
  );

  return {
    downloadReport,
    downloadFinancialReport,
    isDownloading,
  };
}
