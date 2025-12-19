import axiosInstance from "@/shared/lib/apiClient";

export type UpdateEventPaymentInput = {
  eventId: string;
  paymentEnabled: boolean;
};

export type UpdateEventPaymentResponse = {
  id: string;
  paymentStatus: boolean;
};

type UpdateData = {
  id: string;
  status: boolean;
};

export async function updateEventPayment(
  input: UpdateEventPaymentInput
): Promise<UpdateEventPaymentResponse> {
  const data: UpdateData = {
    id: input.eventId,
    status: input.paymentEnabled,
  };

  try {
    const response = await axiosInstance.patch<UpdateEventPaymentResponse>(
      `/events/${data.id}/update/payments`,
      { status: data.status }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating event payment:", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
        "Falha ao atualizar status de pagamento do evento"
    );
  }
}
