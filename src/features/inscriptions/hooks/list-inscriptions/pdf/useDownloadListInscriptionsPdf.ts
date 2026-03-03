"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { listInscriptionsPdf } from "@/features/inscriptions/api/list-inscriptions/pdf/listInscriptionsPdf";
import {
  DownloadListInscriptionsPdfInput,
  ListInscriptionsPdfResponse,
  ProcessListInscriptionsPdfDownloadOptions,
} from "@/features/inscriptions/types/list-inscriptions/pdf/listInscriptionsPdfTypes";
import { useCallback } from "react";
import { toast } from "sonner";

const DEFAULT_ERROR_MESSAGE =
  "Não foi possível gerar o PDF. Tente novamente em instantes.";

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

export default function useDownloadListInscriptionsPdf() {
  const { setLoading } = useGlobalLoading();

  const processDownload = useCallback(
    async (
      fetchPdf: () => Promise<ListInscriptionsPdfResponse>,
      options?: ProcessListInscriptionsPdfDownloadOptions,
    ) => {
      setLoading(true);

      try {
        const response = await fetchPdf();
        const pdfBase64 = response.pdfBase64;
        const filename = response.filename;

        if (!pdfBase64) {
          throw new Error("O servidor não retornou o arquivo PDF.");
        }

        downloadPdf(pdfBase64, filename);
        toast.success(options?.successMessage ?? "Download iniciado.");
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
        toast.error(message || DEFAULT_ERROR_MESSAGE);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const downloadListInscriptionsPdf = useCallback(
    async ({
      eventId,
      isGuest,
      details,
      participants,
    }: DownloadListInscriptionsPdfInput) => {
      if (!eventId) {
        toast.error("Evento não encontrado.");
        return false;
      }

      return processDownload(
        async () =>
          await listInscriptionsPdf(eventId, details, participants, isGuest),
        {
          successMessage: "PDF gerado com sucesso.",
        },
      );
    },
    [processDownload],
  );

  return {
    downloadListInscriptionsPdf,
  };
}
