import {
  DownloadListInscriptionsPdfInput,
  ListInscriptionsPdfResponse,
} from "@/features/inscriptions/types/actions/reports/generateListInscriptionsPdfTypes";
import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";

export async function generatelistInscriptionsPdf({
  eventId,
  participants,
  payment,
  status,
  statusPayment,
  methodPayment,
  isGuest,
  startDate,
  endDate,
}: DownloadListInscriptionsPdfInput): Promise<ListInscriptionsPdfResponse> {
  try {
    const normalizedIsGuest = isGuest === false ? false : undefined;

    const { data } = await axiosInstance.get<ListInscriptionsPdfResponse>(
      `/inscriptions/${eventId}/all/pdf`,
      {
        params: {
          participants,
          payment,
          status,
          statusPayment,
          methodPayment,
          isGuest: normalizedIsGuest,
          startDate,
          endDate,
        },
        paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
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
        "Não foi possível buscar as inscrições.",
    );
  }
}
