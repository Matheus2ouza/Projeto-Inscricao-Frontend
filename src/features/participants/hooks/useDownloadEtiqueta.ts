"use client";

import {
  downloadEtiquetaPdf,
  downloadParticipantsPdfResponse,
} from "@/features/participants/api/downloadParticipantsPdf";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const DEFAULT_ERROR_MESSAGE =
  "Não foi possível baixar a etiqueta. Tente novamente.";

type ProcessDownloadOptions = {
  successMessage?: string;
};

function extractPayload(
  response: downloadParticipantsPdfResponse | undefined
) {
  return response?.data ?? response;
}

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

export function useDownloadEtiqueta(eventId: string) {
  const [isDownloadingEtiqueta, setIsDownloadingEtiqueta] = useState(false);

  const processDownload = useCallback(
    async (
      fetchPdf: () => Promise<downloadParticipantsPdfResponse | undefined>,
      options?: ProcessDownloadOptions
    ): Promise<boolean> => {
      if (!eventId) {
        toast.error("Evento não encontrado.");
        return false;
      }

      setIsDownloadingEtiqueta(true);
      let success = false;

      try {
        const response = await fetchPdf();

        const payload = extractPayload(response);
        const pdfBase64 = payload?.pdfBase64;
        const filename =
          payload?.filename ?? `etiqueta-${eventId.slice(0, 8)}.pdf`;

        if (!pdfBase64) {
          throw new Error(
            payload?.message ?? "O servidor não retornou o arquivo PDF."
          );
        }

        downloadPdf(pdfBase64, filename);
        toast.success(
          options?.successMessage ?? "Etiqueta baixada com sucesso."
        );
        success = true;
      } catch (error) {
        console.error("Erro ao baixar etiqueta:", error);
        const message =
          error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
        toast.error(message || DEFAULT_ERROR_MESSAGE);
      } finally {
        setIsDownloadingEtiqueta(false);
      }

      return success;
    },
    [eventId]
  );

  const downloadEtiqueta = useCallback(
    async (accountId: string) => {
      if (!accountId) {
        toast.error("Conta inválida.");
        return false;
      }

      return processDownload(
        () => downloadEtiquetaPdf({ eventId, accountsId: [accountId] })
      );
    },
    [eventId, processDownload]
  );

  const downloadEtiquetas = useCallback(
    async (accountsId: string[]) => {
      if (!accountsId?.length) {
        toast.error("Selecione pelo menos uma conta.");
        return;
      }

      return processDownload(
        () => downloadEtiquetaPdf({ eventId, accountsId }),
        { successMessage: "Etiquetas baixadas com sucesso." }
      );
    },
    [eventId, processDownload]
  );

  return { downloadEtiqueta, downloadEtiquetas, isDownloadingEtiqueta };
}
