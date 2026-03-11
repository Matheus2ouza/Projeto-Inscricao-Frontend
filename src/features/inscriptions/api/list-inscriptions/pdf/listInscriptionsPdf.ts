import {
  InscriptionStatus,
  ListInscriptionsPdfResponse,
  PaymentMethod,
  StatusPayment,
} from "@/features/inscriptions/types/list-inscriptions/pdf/listInscriptionsPdfTypes";
import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";

export async function listInscriptionsPdf(
  eventId: string,
  participants?: boolean,
  payment?: boolean,
  status?: InscriptionStatus | InscriptionStatus[],
  statusPayment?: StatusPayment | StatusPayment[],
  methodPayment?: PaymentMethod | PaymentMethod[],
  isGuest?: boolean,
  startDate?: string,
  endDate?: string,
): Promise<ListInscriptionsPdfResponse> {
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
