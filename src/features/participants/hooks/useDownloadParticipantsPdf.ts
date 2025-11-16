import { downloadParticipantsPdf } from "@/features/participants/api/downloadParticipantsPdf";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type UseDownloadParticipantsPdfOptions = {
  onSuccess?: () => void;
};

const DEFAULT_ERROR_MESSAGE =
  "Não foi possível gerar o PDF dos participantes. Tente novamente.";

function extractPayload(
  response: {
    data?: {
      pdfBase64?: string;
      filename?: string;
      message?: string;
    };
    pdfBase64?: string;
    filename?: string;
    message?: string;
  } | undefined
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

export function useDownloadParticipantsPdf(
  eventId: string,
  options?: UseDownloadParticipantsPdfOptions
) {
  const [isGenerating, setIsGenerating] = useState(false);
  const onSuccess = options?.onSuccess;

  const generatePdf = useCallback(
    async (accountIds: string[]) => {
      if (!eventId) {
        toast.error("Evento não encontrado.");
        return;
      }

      if (!accountIds?.length) {
        toast.error("Selecione pelo menos uma conta.");
        return;
      }

      try {
        setIsGenerating(true);
        const response = await downloadParticipantsPdf({
          eventId,
          accountIds,
        });

        const payload = extractPayload(response);
        const pdfBase64 = payload?.pdfBase64;
        const filename =
          payload?.filename ?? `participantes-${eventId.slice(0, 8)}.pdf`;

        if (!pdfBase64) {
          throw new Error(
            payload?.message ?? "O servidor não retornou o arquivo PDF."
          );
        }

        downloadPdf(pdfBase64, filename);
        toast.success("PDF gerado com sucesso.");
        onSuccess?.();
      } catch (error) {
        console.error("Erro ao gerar PDF dos participantes:", error);
        const message =
          error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
        toast.error(message || DEFAULT_ERROR_MESSAGE);
      } finally {
        setIsGenerating(false);
      }
    },
    [eventId, onSuccess]
  );

  return {
    generatePdf,
    isGenerating,
  };
}

