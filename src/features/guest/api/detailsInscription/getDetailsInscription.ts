import { InscriptionDetails } from "@/features/guest/types/detailsInscription/detailsInscriptionType";
import axiosInstance from "@/shared/lib/apiClient";

export async function getDetailsInscription(
  confirmationCode: string,
): Promise<InscriptionDetails> {
  try {
    const { data } = await axiosInstance.get<InscriptionDetails>(
      `inscription/guest/${confirmationCode}/details`,
    );
    const raw = data as unknown as Record<string, unknown>;
    const rawPayments = (raw as { payments?: unknown }).payments;
    if (Array.isArray(rawPayments)) {
      (raw as { payments?: unknown[] }).payments = rawPayments.map((item) => {
        if (!item || typeof item !== "object") return item as unknown;
        const payment = item as Record<string, unknown>;
        const rawInstallments =
          payment.PaymentInstallment ??
          payment.paymentInstallments ??
          payment.paymentInstallment;
        if (Array.isArray(rawInstallments)) {
          payment.PaymentInstallment = rawInstallments;
        }
        return payment;
      });
    }

    return raw as unknown as InscriptionDetails;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        "Não foi possível carregar os membros.",
    );
  }
}
