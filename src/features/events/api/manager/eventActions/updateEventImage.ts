import axiosInstance from "@/shared/lib/apiClient";

type UpdateEventImageInput = {
  eventId: string;
  imageBase64: string; // data URL (jpeg)
};

export async function updateEventImage({ eventId, imageBase64 }: UpdateEventImageInput): Promise<void> {
  try {
    await axiosInstance.patch(`/events/${eventId}/update/image`, {
      image: imageBase64,
    });
  } catch (error) {
    console.error("Error updating event image:", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao atualizar a imagem do evento."
    );
  }
}

