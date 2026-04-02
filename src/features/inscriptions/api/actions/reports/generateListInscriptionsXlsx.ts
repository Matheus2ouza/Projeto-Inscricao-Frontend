import {
  GeneratelistInscriptionsXlsxInput,
  GeneratelistInscriptionsXlsxResponse,
} from "@/features/inscriptions/types/actions/reports/generateListInscriptionsXlsxTypes";
import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";

export async function generatelistInscriptionsXlsx({
  eventId,
  participants,
  payment,
  status,
  statusPayment,
  methodPayment,
  isGuest,
  startDate,
  endDate,
}: GeneratelistInscriptionsXlsxInput): Promise<GeneratelistInscriptionsXlsxResponse> {
  try {
    const normalizedIsGuest = isGuest === false ? false : undefined;

    const { data } =
      await axiosInstance.get<GeneratelistInscriptionsXlsxResponse>(
        `/inscriptions/${eventId}/all/xlsx`,
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
