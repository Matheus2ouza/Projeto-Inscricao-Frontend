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
  accountsId: string[];
};

const wrapError = (error: unknown) => {
  const axiosError = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  throw new Error(
    axiosError?.response?.data?.message ?? axiosError?.message ?? "Falha ao tentar gerar o PDF"
  );
};

const postParticipantsPdf = async (url: string, body?: unknown) => {
  try {
    const { data } = await axiosInstance.post<downloadParticipantsPdfResponse>(url, body);
    return data;
  } catch (error) {
    console.error("Error while trying to generate the report: ", error);
    wrapError(error);
  }
};

export async function downloadParticipantsPdf({ eventId, accountsId }: downloadParticipantsPdfInput) {
  return postParticipantsPdf(`/participants/pdf/${eventId}/list-participants/selected`, {
    accountsId,
  });
}

export async function downloadAllParticipantsPdf({ eventId }: { eventId: string }) {
  return postParticipantsPdf(`/participants/pdf/${eventId}/list-participants/all`);
}
