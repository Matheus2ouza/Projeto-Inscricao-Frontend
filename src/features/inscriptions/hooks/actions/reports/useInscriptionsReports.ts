"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { generatelistInscriptionsPdf } from "@/features/inscriptions/api/actions/reports/generateListInscriptionsPdf";
import { generatelistInscriptionsXlsx } from "@/features/inscriptions/api/actions/reports/generateListInscriptionsXlsx";
import {
  DownloadListInscriptionsPdfInput,
  ListInscriptionsPdfResponse,
} from "@/features/inscriptions/types/actions/reports/generateListInscriptionsPdfTypes";
import {
  DownloadListInscriptionsXlsxInput,
  ListInscriptionsXlsxResponse,
} from "@/features/inscriptions/types/actions/reports/generateListInscriptionsXlsxTypes";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

function download(
  pdfBase64: string,
  filename: string,
  contentType:
    | "application/pdf"
    | "application/zip"
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
) {
  const byteCharacters = atob(pdfBase64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function useInscriptionReports() {
  const { setLoading } = useGlobalLoading();

  const { mutateAsync: generatePdfMutation, isPending: isGeneratePdfMutation } =
    useMutation<
      ListInscriptionsPdfResponse,
      Error,
      DownloadListInscriptionsPdfInput
    >({
      mutationFn: generatelistInscriptionsPdf,
      onMutate: () => setLoading(true),
      onSuccess: (data) => {
        const fileBase64 = data.fileBase64;
        const filename = data.filename;
        const contentType = data.contentType;

        if (!fileBase64 || !filename || !contentType) {
          toast.error("Não foi possível gerar o relatório.");
          return;
        }

        download(fileBase64, filename, contentType);
        toast.success("Download iniciado.");
      },
      onError: (error) => {
        toast.error(error.message || "Não foi possível gerar o relatório.");
      },
      onSettled: () => setLoading(false),
    });

  const {
    mutateAsync: generateXlsxMutation,
    isPending: isGenerateXlsxMutation,
  } = useMutation<
    ListInscriptionsXlsxResponse,
    Error,
    DownloadListInscriptionsXlsxInput
  >({
    mutationFn: generatelistInscriptionsXlsx,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      const fileBase64 = data.fileBase64;
      const filename = data.filename;
      const contentType = data.contentType;

      if (!fileBase64 || !filename || !contentType) {
        toast.error("Não foi possível gerar o relatório.");
        return;
      }

      download(fileBase64, filename, contentType);
      toast.success("Download iniciado.");
    },
    onError: (error) => {
      toast.error(error.message || "Não foi possível gerar o relatório.");
    },
    onSettled: () => setLoading(false),
  });

  const handleGeneratePdfReport = async (
    params: DownloadListInscriptionsPdfInput,
  ) => {
    return await generatePdfMutation(params);
  };

  const handleGenerateXlsxReport = async (
    params: DownloadListInscriptionsXlsxInput,
  ) => {
    return await generateXlsxMutation(params);
  };

  return {
    // pdf
    handleGeneratePdfReport,
    isGeneratePdfMutation,

    // xlsx
    handleGenerateXlsxReport,
    isGenerateXlsxMutation,
  };
}
