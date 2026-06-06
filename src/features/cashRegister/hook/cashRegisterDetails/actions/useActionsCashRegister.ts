'use client';

import { useGlobalLoading } from '@/components/GlobalLoading';
import { generatePdf } from '@/features/cashRegister/api/cashRegisterDetails/actions/generatePdf';
import { getFutureReleases } from '@/features/cashRegister/api/cashRegisterDetails/actions/getFutureReleases';
import type {
  FutureRelease,
  FutureReleasesParams,
  GetFutureReleasesResponse,
} from '@/features/cashRegister/types/cashRegisterDetails/actions/futureReleasesTypes';
import type {
  generatePdfParams,
  generatePdfResponse,
} from '@/features/cashRegister/types/cashRegisterDetails/actions/generatePdfTypes';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

function download(
  pdfBase64: string,
  filename: string,
  contentType:
    | 'application/pdf'
    | 'application/zip'
    | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
) {
  const byteCharacters = atob(pdfBase64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function useActionsCashRegister() {
  const { setLoading } = useGlobalLoading();
  const [futureReleases, setFutureReleases] = useState<FutureRelease[]>([]);
  const [futureReleasesError, setFutureReleasesError] = useState<string | null>(
    null,
  );

  const normalizeFutureReleases = useCallback(
    (data: GetFutureReleasesResponse) => {
      if (Array.isArray(data)) return data;
      if (data && typeof data === 'object') return [data];
      return [];
    },
    [],
  );

  const { mutateAsync: generatePdfMutation, isPending: isGeneratingReport } =
    useMutation<generatePdfResponse, Error, generatePdfParams>({
      mutationFn: generatePdf,
      onMutate: () => setLoading(true),
      onSuccess: (data) => {
        const fileBase64 = data.fileBase64;
        const filename = data.filename;
        const contentType = data.contentType;

        if (!fileBase64 || !filename || !contentType) {
          toast.error('Não foi possível gerar o relatório.');
          return;
        }

        download(fileBase64, filename, contentType);
        toast.success('Download iniciado.');
      },
      onError: (error) => {
        toast.error(error.message || 'Não foi possível gerar o relatório.');
      },
      onSettled: () => setLoading(false),
    });

  const handleGenerateReport = async ({
    cashRegisterId,
    listExpenseCategory,
    moviments,
    favorite,
  }: generatePdfParams) => {
    return await generatePdfMutation({
      cashRegisterId,
      listExpenseCategory,
      moviments,
      favorite,
    });
  };

  const {
    mutateAsync: futureReleasesMutation,
    isPending: isLoadingFutureReleases,
  } = useMutation<GetFutureReleasesResponse, Error, FutureReleasesParams>({
    mutationFn: getFutureReleases,
    onSuccess: (data) => {
      setFutureReleases(normalizeFutureReleases(data));
      setFutureReleasesError(null);
    },
    onError: (error) => {
      setFutureReleases([]);
      setFutureReleasesError(
        error.message || 'Não foi possível carregar as futuras liberações.',
      );
    },
  });

  const handleFetchFutureReleases = useCallback(
    async ({ cashRegisterId }: FutureReleasesParams) => {
      setFutureReleasesError(null);
      try {
        const result = await futureReleasesMutation({ cashRegisterId });
        const normalized = normalizeFutureReleases(result);
        setFutureReleases(normalized);
        return normalized;
      } catch (error) {
        const message =
          (error as Error | null)?.message ||
          'Não foi possível carregar as futuras liberações.';
        setFutureReleases([]);
        setFutureReleasesError(message);
        return [];
      }
    },
    [futureReleasesMutation, normalizeFutureReleases],
  );

  return {
    // pdf
    handleGenerateReport,
    isGeneratingReport,

    handleFetchFutureReleases,
    futureReleases,
    futureReleasesError,
    isLoadingFutureReleases,
  };
}
