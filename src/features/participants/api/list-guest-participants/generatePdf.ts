import axiosInstance from "@/shared/lib/apiClient";

export type GeneratePdfLocalityParams = {
  eventId: string;
};

export type GeneratePdfLocalityResponse = {
  pdfBase64: string;
  filename: string;
};

export async function generatePdfLocality({
  eventId,
}: GeneratePdfLocalityParams): Promise<GeneratePdfLocalityResponse> {
  try {
    const { data } = await axiosInstance.get(
      `participants/pdf/${eventId}/locality`,
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
