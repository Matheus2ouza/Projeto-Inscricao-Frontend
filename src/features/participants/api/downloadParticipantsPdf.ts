import axiosInstance from "@/shared/lib/apiClient";

export type downloadParticipantsPdfResponse = {
  data?: {
    pdfBase64?: string;
    filename?: string;
    message?: string;
  };
  pdfBase64?: string;
  filename?: string;
  message?: string;
};

export type downloadParticipantsPdfInput = {
  eventId: string;
  accountIds: string[];
};

export async function downloadParticipantsPdf({ eventId, accountIds }: downloadParticipantsPdfInput) {
  try {
    const { data } = await axiosInstance.post<downloadParticipantsPdfResponse>(`/participants/pdf/${eventId}/list-participants`, {
      accountIds,
    })

    return data
  } catch (error) {
    console.error("Error while trying to generate the report: ", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao tentar gerar o PDF"
    );
  }
}
