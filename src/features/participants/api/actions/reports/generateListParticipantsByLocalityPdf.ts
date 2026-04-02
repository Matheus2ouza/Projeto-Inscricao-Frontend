import axiosInstance from "@/shared/lib/apiClient";

export type GenerateParticipantsByLocalityPdfParams = {
  eventId: string;
  separate: boolean;
  reduced: boolean;
};

export type GenerateParticipantsByLocalityPdfResponse = {
  fileBase64: string;
  filename: string;
  contentType: "application/pdf" | "application/zip";
};

export async function generateParticipantsByLocalityPdf({
  eventId,
  separate = false,
  reduced = false,
}: GenerateParticipantsByLocalityPdfParams): Promise<GenerateParticipantsByLocalityPdfResponse> {
  try {
    const { data } = await axiosInstance.get(
      `participants/pdf/${eventId}/locality`,
      {
        params: {
          separate,
          reduced,
        },
      },
    );
    return data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        "Não foi possível carregar os participantes",
    );
  }
}
