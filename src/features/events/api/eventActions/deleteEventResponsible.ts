import axiosInstance from "@/shared/lib/apiClient";

export async function deleteEventResponsible(
  eventId: string,
  accountId: string
): Promise<void> {
  try {
    await axiosInstance.delete(`/event-responsibles/${eventId}/${accountId}`);
  } catch (error) {
    console.error("Error deleting event responsible:", error);
    throw new Error("Falha ao excluir responsável do evento");
  }
}

