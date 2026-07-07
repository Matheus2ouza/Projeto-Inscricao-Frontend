'use client';

import { useGlobalLoading } from '@/components/GlobalLoading';
import { generateInscriptionDetailsPdf } from '@/features/inscriptions/api/actions/reports/generateInscriptionDetailsPdf';
import { generatelistInscriptionsPdf } from '@/features/inscriptions/api/actions/reports/generateListInscriptionsPdf';
import { generatelistInscriptionsXlsx } from '@/features/inscriptions/api/actions/reports/generateListInscriptionsXlsx';
import {
  GenerateInscriptionDetailsPdfInput,
  GenerateInscriptionDetailsPdfResponse,
} from '@/features/inscriptions/types/actions/reports/generateInscriptionDetailsPdfTypes';
import {
  GeneratelistInscriptionsPdfInput,
  GeneratelistInscriptionsPdfResponse,
} from '@/features/inscriptions/types/actions/reports/generateListInscriptionsPdfTypes';
import {
  GeneratelistInscriptionsXlsxInput,
  GeneratelistInscriptionsXlsxResponse,
} from '@/features/inscriptions/types/actions/reports/generateListInscriptionsXlsxTypes';
import { downloadFile } from '@/shared/utils/downloadFile';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function useInscriptionReports() {
  const { setLoading } = useGlobalLoading();

  // Gera a lista de inscrições em formato PDF
  const {
    mutateAsync: generateListInscriptionPdfMutation,
    isPending: isGeneratePdfMutation,
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
      const contentType = data.contentType;

      if (!fileBase64 || !filename || !contentType) {
        toast.error('Não foi possível gerar o relatório.');
        return;
      }

      downloadFile(fileBase64, filename, contentType);
      toast.success('Download iniciado.');
    },
    onError: (error) => {
      toast.error(error.message || 'Não foi possível gerar o relatório.');
    },
    onSettled: () => setLoading(false),
  });

  // Gera a lista de inscrições em formato XLSX
  const {
    mutateAsync: generateListInscriptionXlsxMutation,
    isPending: isGenerateXlsxMutation,
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
      const contentType = data.contentType;

      if (!fileBase64 || !filename || !contentType) {
        toast.error('Não foi possível gerar o relatório.');
        return;
      }

      downloadFile(fileBase64, filename, contentType);
      toast.success('Download iniciado.');
    },
    onError: (error) => {
      toast.error(error.message || 'Não foi possível gerar o relatório.');
    },
    onSettled: () => setLoading(false),
  });

  // Gera relatorio com os detalhes de uma unica inscrição em formato PDF
  const {
    mutateAsync: generateInscriptionDetailsPdfMutation,
    isPending: isgenerateInscriptionDetailsPdfMutation,
  } = useMutation<
    GenerateInscriptionDetailsPdfResponse,
    Error,
    GenerateInscriptionDetailsPdfInput
  >({
    mutationFn: generateInscriptionDetailsPdf,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      const fileBase64 = data.fileBase64;
      const filename = data.filename;
      const contentType = data.contentType;

      if (!fileBase64 || !filename || !contentType) {
        toast.error('Não foi possível gerar o relatório.');
        return;
      }

      downloadFile(fileBase64, filename, contentType);
      toast.success('Download iniciado.');
    },
    onError: (error) => {
      toast.error(error.message || 'Não foi possível gerar o relatório.');
    },
    onSettled: () => setLoading(false),
  });

  return {
    // Lista de inscrições - PDF
    handleGeneratePdfReport: generateListInscriptionPdfMutation,
    isGeneratePdfMutation,

    // Lista de inscrições - XLSX
    handleGenerateXlsxReport: generateListInscriptionXlsxMutation,
    isGenerateXlsxMutation,

    // Detalhes da Inscrição - PDF
    handleGenerateDetailsInscriptionPdfReport:
      generateInscriptionDetailsPdfMutation,
    isgenerateInscriptionDetailsPdfMutation,
  };
}
