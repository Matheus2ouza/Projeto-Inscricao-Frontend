'use client';

import { useGlobalLoading } from '@/components/GlobalLoading';
import {
  generateParticipantsByLocalityPdf,
  type GenerateParticipantsByLocalityPdfParams,
  type GenerateParticipantsByLocalityPdfResponse,
} from '@/features/participants/api/actions/reports/generateListParticipantsByLocalityPdf';
import {
  generateParticipantsByLocalityXlsx,
  GenerateParticipantsByLocalityXlsxParams,
  GenerateParticipantsByLocalityXlsxResponse,
} from '@/features/participants/api/actions/reports/generateListParticipantsByLocalityXlsx';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  generateParticipantsFromRoomPdf,
  GenerateParticipantsFromRoomPdfParams,
  GenerateParticipantsFromRoomPdfResponse,
} from '../../api/actions/reports/generateListParticipantsFromRoom';

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

export function useParticipantsReports() {
  const { setLoading } = useGlobalLoading();

  // Gera pdf para lista de inscrições com base na localidade
  const {
    mutateAsync: generatePdfLocalityMutation,
    isPending: isGeneratePdfLocalityMutation,
  } = useMutation<
    GenerateParticipantsByLocalityPdfResponse,
    Error,
    GenerateParticipantsByLocalityPdfParams
  >({
    mutationFn: generateParticipantsByLocalityPdf,
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

  // Gera xlsx para lista de inscrições com base na localidade
  const {
    mutateAsync: generateXlsxLocalityMutation,
    isPending: isGenerateXlsxLocalityMutation,
  } = useMutation<
    GenerateParticipantsByLocalityXlsxResponse,
    Error,
    GenerateParticipantsByLocalityXlsxParams
  >({
    mutationFn: generateParticipantsByLocalityXlsx,
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

  const {
    mutateAsync: generatePdfRoomMutation,
    isPending: isGeneratePdfRoomMutation,
  } = useMutation<
    GenerateParticipantsFromRoomPdfResponse,
    Error,
    GenerateParticipantsFromRoomPdfParams
  >({
    mutationFn: generateParticipantsFromRoomPdf,
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

  const handleGenerateLocalityPdfReport = async ({
    eventId,
    separate,
    reduced,
    summary,
    typeInscriptions,
    columns,
    startDate,
    endDate,
    inscriptionsStatus,
  }: GenerateParticipantsByLocalityPdfParams) => {
    return await generatePdfLocalityMutation({
      eventId,
      separate,
      reduced,
      summary,
      typeInscriptions,
      columns,
      startDate,
      endDate,
      inscriptionsStatus,
    });
  };

  const handleGenerateLocalityXlsxReport = async ({
    eventId,
    separate,
    summary,
    typeInscriptions,
    columns,
    startDate,
    endDate,
    inscriptionsStatus,
  }: GenerateParticipantsByLocalityXlsxParams) => {
    return await generateXlsxLocalityMutation({
      eventId,
      separate,
      summary,
      typeInscriptions,
      columns,
      startDate,
      endDate,
      inscriptionsStatus,
    });
  };

  const handleGeneratePdfRoomPdfReport = async ({
    title,
    observation,
    listParticipants,
  }: GenerateParticipantsFromRoomPdfParams) => {
    return await generatePdfRoomMutation({
      title,
      observation,
      listParticipants,
    });
  };

  return {
    // pdf
    handleGenerateLocalityPdfReport,
    isGeneratePdfLocalityMutation,

    // xlsx
    handleGenerateLocalityXlsxReport,
    isGenerateXlsxLocalityMutation,

    // pdf
    handleGeneratePdfRoomPdfReport,
    isGeneratePdfRoomMutation,
  };
}
