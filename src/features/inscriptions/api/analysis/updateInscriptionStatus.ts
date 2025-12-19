import axiosInstance from "@/shared/lib/apiClient";

export async function updateInscriptionStatus(
  inscriptionId: string,
  status: "PENDING" | "CANCELLED"
): Promise<void> {
  try {
    await axiosInstance.patch(`/inscriptions/${inscriptionId}/update`, {}, {
      params: {
        status: status
      }
    });
  } catch (error) {
    console.error("Error updating inscription status:", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    // Log detalhado para debug
    console.log("Axios error response:", axiosError.response?.data);
    console.log("Error message:", axiosError.response?.data?.message);

    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao atualizar status da inscrição"
    );
  }
}
