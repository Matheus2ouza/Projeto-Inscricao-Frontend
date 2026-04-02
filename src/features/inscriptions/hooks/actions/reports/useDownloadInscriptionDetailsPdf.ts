"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { generateListInscriptionDetailsPdf } from "@/features/inscriptions/api/actions/reports/generateInscriptionDetailsPdf";
import {
  ListDownloadInscriptionDetailsPdfInput,
  ListInscriptionsPdfResponse,
} from "@/features/inscriptions/types/actions/reports/generateInscriptionDetailsPdfTypes";
import { downloadFile } from "@/shared/utils/downloadFile";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const DEFAULT_ERROR_MESSAGE =
  "Não foi possível gerar o PDF. Tente novamente em instantes.";

export function useDownloadInscriptionDetailsPdf() {
  const { setLoading } = useGlobalLoading();
  const [isDownloadingInscriptionPdf, setIsDownloadingInscriptionPdf] =
    useState(false);

  const processDownload = useCallback(
    async (fetchPdf: () => Promise<ListInscriptionsPdfResponse>) => {
      setLoading(true);
      setIsDownloadingInscriptionPdf(true);

      try {
        const response = await fetchPdf();
        const fileBase64 = response.fileBase64;
        const filename = response.filename;
        const contentType = response.contentType;

        if (!fileBase64 || !filename || !contentType) {
          toast.error("Não foi possível gerar o relatório.");
          return;
        }

        downloadFile(fileBase64, filename, contentType);
        toast.success("Download iniciado.");
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
        toast.error(message || DEFAULT_ERROR_MESSAGE);
        return false;
      } finally {
        setLoading(false);
        setIsDownloadingInscriptionPdf(false);
      }
    },
    [setLoading, setIsDownloadingInscriptionPdf],
  );

  const downloadInscriptionDetailsPdf = useCallback(
    async ({ inscriptionId }: ListDownloadInscriptionDetailsPdfInput) => {
      if (!inscriptionId) {
        toast.error("Inscrição não encontrada.");
        return false;
      }

      return processDownload(
        async () => await generateListInscriptionDetailsPdf({ inscriptionId }),
      );
    },
    [processDownload],
  );

  return {
    downloadInscriptionDetailsPdf,
    isDownloadingInscriptionPdf,
  };
}
