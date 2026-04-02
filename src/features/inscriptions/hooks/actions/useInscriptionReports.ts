"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { generatelistInscriptionsPdf } from "@/features/inscriptions/api/actions/reports/generateListInscriptionsPdf";
import { generatelistInscriptionsXlsx } from "@/features/inscriptions/api/actions/reports/generateListInscriptionsXlsx";
import {
  GeneratelistInscriptionsPdfInput,
  GeneratelistInscriptionsPdfResponse,
} from "@/features/inscriptions/types/actions/reports/generateListInscriptionsPdfTypes";
import {
  GeneratelistInscriptionsXlsxInput,
  GeneratelistInscriptionsXlsxResponse,
} from "@/features/inscriptions/types/actions/reports/generateListInscriptionsXlsxTypes";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type ListInscriptionsReportContentType =
  | "application/pdf"
  | "application/zip"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function download(
  fileBase64: string,
  filename: string,
  contentType: ListInscriptionsReportContentType,
) {
  const byteCharacters = atob(fileBase64);
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

export function useInscriptionReports() {
  const { setLoading } = useGlobalLoading();

  const {
    mutateAsync: generatePdfListMutation,
    isPending: isGeneratePdfListMutation,
  } = useMutation<
    GeneratelistInscriptionsPdfResponse,
    Error,
    GeneratelistInscriptionsPdfInput
  >({
    mutationFn: generatelistInscriptionsPdf,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      const fileBase64 = data.fileBase64;
      const filename = data.filename;
      const contentType =
        (data.contentType as ListInscriptionsReportContentType) ??
        "application/pdf";

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
    mutateAsync: generateXlsxListMutation,
    isPending: isGenerateXlsxListMutation,
  } = useMutation<
    GeneratelistInscriptionsXlsxResponse,
    Error,
    GeneratelistInscriptionsXlsxInput
  >({
    mutationFn: generatelistInscriptionsXlsx,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      const fileBase64 = data.fileBase64;
      const filename = data.filename;
      const contentType =
        (data.contentType as ListInscriptionsReportContentType) ??
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

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

  const handleGenerateListInscriptionsPdfReport = async (
    params: GeneratelistInscriptionsPdfInput,
  ) => generatePdfListMutation(params);

  const handleGenerateListInscriptionsXlsxReport = async (
    params: GeneratelistInscriptionsXlsxInput,
  ) => generateXlsxListMutation(params);

  return {
    handleGenerateListInscriptionsPdfReport,
    isGeneratePdfListMutation,
    handleGenerateListInscriptionsXlsxReport,
    isGenerateXlsxListMutation,
  };
}
