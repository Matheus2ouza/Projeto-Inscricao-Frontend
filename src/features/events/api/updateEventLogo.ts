import axiosInstance from "@/shared/lib/apiClient";

type UpdateEventLogoInput = {
  eventId: string;
  imageBase64: string;
}

export async function updateEventLogo({ eventId, imageBase64 }: UpdateEventLogoInput): Promise<void> {
  try {
    await axiosInstance.patch(`/events/${eventId}/update/logo`, {
      image: imageBase64
    })
  } catch (error) {
    console.error("Error updating event logo:", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao atualizar a logo do evento"
    );
  }
}
