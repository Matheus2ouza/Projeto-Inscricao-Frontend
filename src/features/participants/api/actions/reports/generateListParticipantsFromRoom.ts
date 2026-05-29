import axiosInstance from '@/shared/lib/apiClient';

// Tipo para participantes reais (do banco)
export type RealParticipant = {
  id: string;
};

// Tipo para participantes personalizados (acompanhantes)
export type CustomParticipant = {
  id: string;
  name: string;
  isCustom: true;
  locality?: string;
};

export type ParticipantsRoom = RealParticipant | CustomParticipant;

export type GenerateParticipantsFromRoomPdfParams = {
  title: string;
  observation?: string;
  listParticipants: ParticipantsRoom[];
};

export type GenerateParticipantsFromRoomPdfResponse = {
  fileBase64: string;
  filename: string;
  contentType: 'application/pdf' | 'application/zip';
};

export async function generateParticipantsFromRoomPdf({
  title,
  observation,
  listParticipants,
}: GenerateParticipantsFromRoomPdfParams): Promise<GenerateParticipantsFromRoomPdfResponse> {
  try {
    const { data } = await axiosInstance.post(`participants/pdf/room`, {
      title,
      observation,
      listParticipants,
    });

    return data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi possível gerar o relatorio',
    );
  }
}
