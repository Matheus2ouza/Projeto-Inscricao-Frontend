"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import {
  generatePdfLocality,
  type GeneratePdfLocalityParams,
  type GeneratePdfLocalityResponse,
} from "@/features/participants/api/list-guest-participants/generatePdf";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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

export function useActionsGuestParticipants() {
  const { setLoading } = useGlobalLoading();

  const {
    mutateAsync: generatePdfLocalityMutation,
    isPending: isGeneratingPdf,
  } = useMutation<
    GeneratePdfLocalityResponse,
    Error,
    GeneratePdfLocalityParams
  >({
    mutationFn: generatePdfLocality,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      const pdfBase64 = data?.pdfBase64;
      const filename = data?.filename;

      if (!pdfBase64 || !filename) {
        toast.error("Não foi possível gerar o relatório.");
        return;
      }

      downloadPdf(pdfBase64, filename);
      toast.success("Download iniciado.");
    },
    onError: (error) => {
      toast.error(error.message || "Não foi possível gerar o relatório.");
    },
    onSettled: () => setLoading(false),
  });

  const handleGenerateReport = async ({
    eventId,
  }: GeneratePdfLocalityParams) => {
    return await generatePdfLocalityMutation({ eventId });
  };

  return {
    handleGenerateReport,
    isGeneratingPdf,
  };
}
